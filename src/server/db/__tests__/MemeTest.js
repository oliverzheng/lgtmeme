// @flow
// @format

import invariant from 'invariant';
import {type Connection, connect, disconnect} from './__mocks__/mockmongoose';

// This must be imported after mockgoose wrapper
import {MemeCollectionDoc, getMemeCollection} from '../MemeCollection';
import {MemeDoc, getMemeModelForCollection} from '../Meme';

describe('Meme', () => {
  let connection: Connection;
  let collection: MemeCollectionDoc;

  beforeAll(async () => {
    connection = await connect();
    const MemeCollection = getMemeCollection(connection.mongooseConnection);

    collection = new MemeCollection();
    collection.name = 'Water Pokemons';
    await collection.save();
  });

  afterAll(async () => {
    await disconnect(connection);
  });

  describe('Model', () => {
    test('can create model from collection', async () => {
      const Meme = getMemeModelForCollection(collection);
      expect(Meme.modelName).toEqual(`Meme_${collection.id}`);
    });
  });

  describe('Document', () => {
    let Meme: typeof MemeDoc;

    beforeAll(async () => {
      Meme = getMemeModelForCollection(collection);
    });

    beforeEach(async () => {
      await Meme.deleteMany({}); // clear out previous things
    });

    test('cannot get a non-existent meme', async () => {
      const fetchedMeme = await Meme.findById('123456789012345678901234');
      expect(fetchedMeme).toBeNull();
    });

    test('can add and get a meme document', async () => {
      const meme = new Meme();
      meme.macro = 'dogscience';
      await meme.save();

      expect(meme.id).toBeTruthy();

      const fetchedMeme = await Meme.findById(meme.id);
      expect(fetchedMeme).toBeTruthy();
      invariant(fetchedMeme, 'flow');
      expect(fetchedMeme.macro).toEqual('dogscience');
    });

    test('cannot add a meme without a macro', async () => {
      const meme = new Meme();
      await expect(meme.save()).rejects.toThrow();
    });

    test('can delete meme document', async () => {
      const meme = new Meme();
      meme.macro = 'herpderp';
      await meme.save();
      await meme.remove();

      const fetchedMeme = await Meme.findById(meme.id);
      expect(fetchedMeme).toBeNull();
    });

    test('can update meme document', async () => {
      const meme = new Meme();
      meme.macro = 'lolwut';
      await meme.save();
      meme.macro = 'stahp';
      await meme.save();

      const fetchedMeme = await Meme.findById(meme.id);
      invariant(fetchedMeme, 'flow');
      expect(fetchedMeme.macro).toEqual('stahp');
    });

    test('cannot add duplicate macros', async () => {
      const meme1 = new Meme();
      meme1.macro = 'heygirl';
      await meme1.save();

      const meme2 = new Meme();
      meme2.macro = 'heygirl';
      await expect(meme2.save()).rejects.toThrow('duplicate');

      meme2.macro = 'okayjpg';
      await meme2.save();

      meme2.macro = 'heygirl';
      await expect(meme2.save()).rejects.toThrow('duplicate');
    });

    test('can find meme by macro', async () => {
      const meme1 = new Meme();
      meme1.macro = 'dafuq';
      await meme1.save();

      const meme2 = new Meme();
      meme2.macro = 'iknowsomeofthosewords';
      await meme2.save();

      const foundMemes = await Meme.find({macro: 'dafuq'});
      expect(foundMemes).toHaveLength(1);
      expect(foundMemes[0].macro).toEqual('dafuq');
    });

    test('can list memes from collection', async () => {
      const meme1 = new Meme();
      meme1.macro = 'cookiemonster';
      const meme2 = new Meme();
      meme2.macro = 'awkwardseal';
      await Promise.all([meme1.save(), meme2.save()]);

      const foundMemes = await Meme.find();
      expect(foundMemes).toHaveLength(2);
      const allMacros = foundMemes.map(m => m.macro).sort();
      expect(allMacros).toEqual(['awkwardseal', 'cookiemonster']);
    });
  });
});
