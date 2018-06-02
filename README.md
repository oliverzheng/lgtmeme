# LGTMeme

## Running server:

Download and run [Docker for Mac] to host the prerequisite service dependencies, like the Mongo database.

Using [Visual Studio Code], run tasks:

* `docker:mongo` (this runs a mongo server on port 2701)
* `docker:adminmongo` (this runs the [adminmongo] frontend)

Then use the Debug panel to run `debug:server`.

## Developing

Install the recommended `flow` and `prettier` extensions recommended by [Visual Studio Code].

Precommit hooks are auto enabled to check for `flow` errors and use `prettier`
to format files.

[Docker for Mac]: https://store.docker.com/editions/community/docker-ce-desktop-mac
[Visual Studio Code]: https://code.visualstudio.com
[adminmongo]: http://localhost:1234/app/lgtmeme
