# LGTMeme

## Running server:

### From the terminal

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

### From Visual Studio Code

Download and run [Docker for Mac] to host the prerequisite service dependencies, like the Mongo database.

Using [Visual Studio Code], run tasks:

* `docker:mongo` (this runs a mongo server on port 2701)
* `docker:adminmongo` (this runs the [adminmongo dashboard])

Then use the Debug panel to run `debug:server`.

## Developing

### From the terminal

Install `flow` typings: `yarn typings:install`. Run `yarn flow:watch` to
constantly check for flow errors.

Precommit hooks are auto enabled to check for `flow` errors and use `prettier`
to format files.

### From Visual Studio Code

Install the recommended `flow` and `prettier` extensions recommended by [Visual Studio Code].

Precommit hooks are auto enabled to check for `flow` errors and use `prettier`
to format files.

[adminmongo]: https://github.com/mrvautin/adminMongo
[docker for mac]: https://store.docker.com/editions/community/docker-ce-desktop-mac
[visual studio code]: https://code.visualstudio.com
[adminmongo dashboard]: http://localhost:1234/app/lgtmeme
