# API and MONGODB

## Run project

### .env

You need to copy the file `.env.exemple` and **rename** to `.env`.
Inside that file are all the configurations you will need to run.
The only thing you must change is the `DB_PASS=strong_password` when you define the mongo user, you will probably use a better password.

### CONFIG API

#### Run
In the first run, you will need to run the chmod.

```bash
chmod +x ./startdocker.sh
chmod +x ./stopdocker.sh
chmod +x ./startinitdocker.sh
```

##### Now you can run both of the scripts

To start:

```bash
./startdocker.sh
```

To stop:

```bash
./stopdocker.sh
```

#### Configure mode

At `.env` you probably have something like "API_MODE=dev". You can switch between {prod, dev}; it changes what `npm` will run.

### Config Database Servers

#### **You don't need to do anything here the script do this and more.**

#### Run

In the first run, you will need to run the docker docker-compose.db.yml. We will give more details about what it actually does later.

```bash
docker compose -f ./docker-compose.db.yml up --build
```

Before the first run, you can just run.

```bash
docker compose -f ./docker-compose.db.yml up
```

Or if you don`t want to see the log (-d for detach).

```bash
docker compose -f ./docker-compose.db.yml up -d
```
#### Create User and Database

To connect to the db you will need a user. You can do this connecting to the mongosh

```bash
docker exec -it mongos-router0 mongosh
```
Change and create database
```shell
use VaporBase
```
Create user for api
```shell
db.createUser({
  user: "api_user",
  pwd: "strong_password",
  roles: [{ role: "readWrite", db: "VaporBase" }]
});
```
Enable sharding
```shell
sh.enableSharding("VaporBase");
```
```shell
sh.setBalancerState(true);
```
Configure sharding
```shell
sh.shardCollection("VaporBase.Users", { username: 1 })
sh.shardCollection("VaporBase.Categories", { categorySTR: 1 })
sh.shardCollection("VaporBase.Products", { _id: "hashed" })
sh.shardCollection("VaporBase.Tags", { tagSTR: 1 })
sh.shardCollection("VaporBase.Titles", { titleSTR: 1 })

```

  More about roles.
  |    Role     |                                  Description                                    |
  |:---------:  |:------------------------------------------------------------------------------: |
  | read        | Can only read data in the database.                                             |
  | readWrite   | Can read and write data but cannot delete users or change settings.             |
  | dbAdmin     | Can perform administrative actions like creating indexes but not modify data.   |
  | userAdmin   | Can create and manage users for a database.                                     |
  | dbOwner     | Full control over a database (combines readWrite, dbAdmin, and userAdmin).      |

## How it work

### API

We use docker compose to run the 3 API instances, enabling horizontal scaling with nginx which serves as a load balancer, and manages the https certificate container. All of them are connected to a network to access the mongodb

The API runs the server.js following the package.json configuration. The api needs to wait for the cert generator as all other apps are on `docker-compose.web.yml`. The nginx joins all the APIs as one.

### DATABASE

We are using mongodb with sharding, which means we do have more than one mongo instance.

The mongo sharding is based in three parts

|                        Component                        |                Stores                 | Storage Requirement   |
|:------------------------------------------------------: |:------------------------------------: |:-------------------:  |
| Config Servers  | Metadata (shard info, chunk mapping)  | Low                   |
| Shard Servers   | Actual user data                      | High                  |
| Mongos Router   | Routes queries (no data storage)      | Minimal               |

You could learn more in [mongodb sharding manual](https://www.mongodb.com/docs/manual/sharding/)

Almost all of the sharding configuration was taken from the repository [pkdone/sharded-mongodb-docker](https://github.com/pkdone/sharded-mongodb-docker)