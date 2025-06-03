# API and MONGODB

## Run project

### .env

You need to copy the file `.env.exemple` and **rename** to `.env`.
Inside that file are all the configurations you will need to run.
The only thing you must change is the `DB_PASS=strong_password` when you define the mongo user, you will probably use a better password.

### CONFIG API

#### Configure mode

At `.env` you probably have something like "API_MODE=dev". You can switch between {prod, dev}; it changes what `npm` will run.

### Config Database Servers

#### Run

In the first run, you will need to run the chmod to make the script executable.

```bash
chmod +x ./mongo-cluster/*.sh
```

Now you can run the docker compose

```bash
docker compose -f ./docker-compose.db.yml up -d
```

Before conteiners are ready (may take a time ">20s" because of sharding), run the script to create user, db, shardkey, more...

```bash
docker exec -it mongos-router0 mongosh /scripts/db-seed-user.js
```

### API cert

Run this command to create a Self-Signed SSL cert:

```bash
mkdir ./certs
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout ./certs/privkey.pem \
  -out ./certs/fullchain.pem \
  -subj "/CN=localhost"
```

#### Change from data from DB

Connect to DB

```bash
docker exec -it mongos-router0 mongosh
```

If you want to modify a normal user to be admin

```js
db.Users.findOneAndUpdate(
  { _id: ObjectId("PUT_USER_ID_HERE") },
  { $set: { isAdmin: true } }
)
```

#### Create User and Database

##### **You don't need to do anything here, the previous script do this for you, do this just in case you are deploying this api.**

To connect to the db you will need a user. You can do this connecting to the mongosh

```bash
docker exec -it mongos-router0 mongosh
```

Change and create database

```js
use VaporBase
```

Create user for api

```js
db.createUser({
  user: "api_user",
  pwd: "strong_password",
  roles: [{ role: "readWrite", db: "VaporBase" }]
});
```

Enable sharding

```js
sh.enableSharding("VaporBase");
```

```js
sh.setBalancerState(true);
```

Configure sharding

```js
sh.shardCollection("VaporBase.Users", { _id: "hashed" });
sh.shardCollection("VaporBase.Categories", { _id: "hashed" });
sh.shardCollection("VaporBase.Products", { _id: "hashed" });
sh.shardCollection("VaporBase.Tags", { _id: "hashed" });
sh.shardCollection("VaporBase.Titles", { _id: "hashed" });
sh.shardCollection("VaporBase.Images", { _id: "hashed" });
sh.shardCollection("VaporBase.Suggestions", { _id: "hashed" });
sh.shardCollection("VaporBase.Reviews", { _id: "hashed" });
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