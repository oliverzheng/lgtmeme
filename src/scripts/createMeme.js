// @flow
// @format

// $ node createMeme.js <collection-name> <path_to_jpg> <macro>

import fs from 'fs';

import {connect, disconnect, getConnection} from '../server/db';
import {
  MemeCollectionDoc,
  getMemeCollection,
} from '../server/db/MemeCollection';
import {getMemeModelForCollection} from '../server/db/Meme';
import {ImageDoc} from '../server/db/Image';
import {
  S3_BUCKET_NAME,
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
} from '../server/env';
import S3Storage from '../server/storage/S3Storage';

const s3Storage = new S3Storage(
  S3_BUCKET_NAME,
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
);

async function getOrCreateSandboxMemeCollection(
  MemeCollection: typeof MemeCollectionDoc,
  collectionName: string,
): Promise<MemeCollectionDoc> {
  let collection = await MemeCollection.findOne({name: collectionName});
  if (!collection) {
    collection = new MemeCollection();
    collection.name = collectionName;
    await collection.save();
  }
  return collection;
}

async function createMeme(
  collectionName: string,
  localFilePath: string,
  macro: string,
) {
  console.log(
    `Creating meme with macro '${macro}' by copying local file ${localFilePath}...`,
  );

  await connect();

  try {
    const MemeCollection = getMemeCollection(getConnection());
    const memeCollection = await getOrCreateSandboxMemeCollection(
      MemeCollection,
      collectionName,
    );
    const Meme = getMemeModelForCollection(memeCollection);
    const existingMeme = await Meme.findOne({macro});
    if (existingMeme) {
      throw new Error(`The macro ${macro} already exists.`);
    }

    const newMeme = new Meme();
    newMeme.macro = macro;
    newMeme.sourceImage = await ImageDoc.uploadImage(s3Storage, localFilePath);
    await newMeme.save();

    const url = await s3Storage.getFileUrl(newMeme.sourceImage.fileID);
    console.log(`Meme saved, accessible at ${url}`);
  } finally {
    await disconnect();
  }
}

const collectionName = process.argv[2];
if (!collectionName) {
  throw new Error('Need to specify a collection name');
}

const localFilePath = process.argv[3];
if (!localFilePath || !fs.existsSync(localFilePath)) {
  throw new Error(`Local file path $({localFilePath}) does not exist`);
}

const macro = process.argv[4];
if (!macro) {
  throw new Error('Need to specify a macro');
}

createMeme(collectionName, localFilePath, macro).catch(error => {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
});
