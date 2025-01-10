<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# nest.js-test

This project is a scaled-down version of my [NestJS Virgool](https://github.com/saeedNW/nest.js-virgool) project. It is designed to serve as a complete, yet simpler, application for gaining practical experience in writing tests with NestJS.

## Features

- **User Authentication**: Secure registration, login, and session management using OTP.
- **Article Management**: CRUD operations for articles.
- **Profile Management**: User profile management

## Table of Content

- [nest.js-test](#nestjs-test)
  - [Features](#features)
  - [Table of Content](#table-of-content)
  - [Prerequisites](#prerequisites)
  - [Installation and Setup](#installation-and-setup)
  - [Database Setup with Docker](#database-setup-with-docker)
    - [Run PostgreSQL Service](#run-postgresql-service)
    - [Run pgAdmin Service](#run-pgadmin-service)
    - [Create a New PostgreSQL Server and Database](#create-a-new-postgresql-server-and-database)
  - [Running the Application](#running-the-application)
  - [Running Tests](#running-tests)
  - [License](#license)
  - [Contributors](#contributors)

## Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [Docker](https://www.docker.com)
- [PostgreSQL](https://www.postgresql.org/)
- [pgAdmin](https://www.pgadmin.org/)

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/saeedNW/nest.js-test.git
   ```

2. Navigate to the project directory:

   ```bash
   cd nest.js-test
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

> **Note:** The application defaults to port `3000`.

## Database Setup with Docker

### Run PostgreSQL Service

Start a PostgreSQL container with the following command:

```bash
docker run -d \
  --name postgres_container \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=root \
  -p 5432:5432 \
  postgres
```

### Run pgAdmin Service

Launch a pgAdmin container for managing the database:

```bash
docker run -d \
  --name pgadmin_container \
  -e PGADMIN_DEFAULT_EMAIL=admin@example.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  -p 8080:80 \
  --link postgres_container:postgres \
  dpage/pgadmin4
```

Access pgAdmin at [http://localhost:8080](http://localhost:8080) using the credentials `admin@example.com`/`admin`.

### Create a New PostgreSQL Server and Database

1. In pgAdmin, create a new server:

   - **Name:** `localhost`
   - **Connection:**
     - **Host:** `postgres`
     - **Port:** `5432`
     - **Username:** `postgres`
     - **Password:** `root`

2. Create a database:
   - **Name:** `nestjs_test`

## Running the Application

```bash
# Development mode
npm run start

# Watch mode
npm run start:dev

# Build production
npm run build

# Production mode
npm run start:prod
```

## Running Tests

```bash
# Unit tests
npm run test

# End-to-end (e2e) tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch tests
npm run test:watch
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Contributors

![Contributor Avatar](https://images.weserv.nl/?url=https://github.com/saeedNW.png?h=150&w=150&fit=cover&mask=circle&maxage=5d)

[**Saeed Norouzi - Back-end Developer**](https://github.com/saeedNW)
