# AoE2 Data Api

## Description

Api for getting data bout Age of Empires II game civilizations, ages, units, techs, and buildings.

## Docs

Api documentation is hosted at [https://aoe2-data-api.herokuapp.com/docs](https://aoe2-data-api.herokuapp.com/) provided by NestJS and Swagger.

To see the docs during development run the project and navigate to [`localhost:4000/docs`](http://localhost:4000/docs#/).

## Prerequisites

- [node](https://nodejs.org/en/) (preferably through nvm)
- [docker](https://www.docker.com/) (for dev db only)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Updating database

Seed data is generated through a fork of the aoe2techtree project.

https://github.com/amrtgaber/aoe2techtree

The scripts are in the `data-conversion` folder.

After running the scripts successfully, copy the files into `prisma/seed-data` to replace the files with the same names.

## License

[MIT licensed](LICENSE).

---

Age of Empires II © Microsoft Corporation. Age of Empires II Data Api was created under Microsoft's "[Game Content Usage Rules](https://www.xbox.com/en-us/developers/rules)" using assets from Age of Empires II and it is not endorsed by or affiliated with Microsoft.
