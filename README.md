# LGTMeme

## Running server:

Make sure MongoDB is running. Use something like [adminMongo][adminmongo] to
setup user and database.

Add a `.env` file to the root directory of this repo, with

```
SERVER_PORT=3000
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
MONGODB_USER=<user>
MONGODB_PASS=<pass>
MONGODB_DB=<dbname>
```

Then run

```
yarn install # install dependencies
yarn server:debug # run debug version of server
```

## Developing

Install `flow` typings: `yarn typings:install`. Run `yarn flow:watch` to
constantly check for flow errors.

Precommit hooks are auto enabled to check for `flow` errors and use `prettier`
to format files.

[adminmongo]: https://github.com/mrvautin/adminMongo
