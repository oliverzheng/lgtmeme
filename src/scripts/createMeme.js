// @flow
// @format

// $ node createMeme.js <collection-slug> <path_to_jpg> <macro>

import fs from 'fs';
import path from 'path';
import appRoot from 'app-root-path';

import {connect, disconnect, getConnection} from '../server/db';
import {
  MemeCollectionDoc,
  getMemeCollection,
} from '../server/db/MemeCollection';
import {getMemeModelForCollection} from '../server/db/Meme';
import {ImageDoc} from '../server/db/Image';
import LocalFileStorageConfig from '../server/storage/LocalFileStorageConfig';
import LocalFileStorage from '../server/storage/LocalFileStorage';

const HOST = '127.0.0.1';
const PORT = LocalFileStorageConfig.SERVER_PORT;
const DIR = path.join(appRoot.toString(), LocalFileStorageConfig.ROOT_DIR);

const localFileStorage = new LocalFileStorage(DIR, `http://${HOST}:${PORT}`);

async function getOrCreateSandboxMemeCollection(
  MemeCollection: typeof MemeCollectionDoc,
  collectionSlug: string,
): Promise<MemeCollectionDoc> {
  let collection = await MemeCollection.findOne({slug: collectionSlug});
  if (!collection) {
    collection = new MemeCollection();
    collection.name = collectionSlug;
    collection.slug = collectionSlug;
    await collection.save();
  }
  return collection;
}

async function createMeme(
  collectionSlug: string,
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
      collectionSlug,
    );
    const Meme = getMemeModelForCollection(memeCollection);
    const existingMeme = await Meme.findOne({macro});
    if (existingMeme) {
      throw new Error(`The macro ${macro} already exists.`);
    }

    const newMeme = new Meme();
    newMeme.macro = macro;
    newMeme.sourceImage = await ImageDoc.uploadImage(
      localFileStorage,
      localFilePath,
    );
    await newMeme.save();

    const url = await localFileStorage.getFileUrl(newMeme.sourceImage.fileID);
    console.log(`Meme saved, accessible at ${url}`);
  } finally {
    await disconnect();
  }
}

const collectionSlug = process.argv[2];
if (!collectionSlug) {
  throw new Error('Need to specify a collection slug');
}

const localFilePath = process.argv[3];
if (!localFilePath || !fs.existsSync(localFilePath)) {
  throw new Error(`Local file path $({localFilePath}) does not exist`);
}

const macro = process.argv[4];
if (!macro) {
  throw new Error('Need to specify a macro');
}

createMeme(collectionSlug, localFilePath, macro).catch(error => {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
});