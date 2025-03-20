#
## Run project

first time:
```shell
docker compose up --remove-orphans --build
```
before you could just:
```shell
docker compose up --remove-orphans
```

## Database

|                        Component                       	|                Stores                	| Storage Requirement 	|
|:------------------------------------------------------:	|:------------------------------------:	|:-------------------:	|
| Config Servers (config1, config2, config3)             	| Metadata (shard info, chunk mapping) 	| Low                 	|
| Shard Servers (shard1-1, shard1-2, shard2-1, shard2-2) 	| Actual user data                     	| High                	|
| Mongos Router (mongos)                                 	| Routes queries (no data storage)     	| Minimal             	|

### Config Servers

The config servers (config1, config2, config3) store metadata about the cluster, such as:

1. Shard Mapping -> Which data belongs to which shard.
2. Chunk Distribution -> Information on how MongoDB splits and moves data across shards.
3. Balancer State -> Helps MongoDB balance data between shards.
4. Cluster Authentication -> If enabled, stores authentication settings.

To init db, run:
```shell
docker exec -i mongos_router mongosh < ./mongo_script/init-mongo.js
docker exec -i mongos_router mongosh < ./mongo_script/init-shards.js
docker exec -i mongos_router mongosh < ./mongo_script/shard-setup.js
```

    env_file:
      - .env

docker compose -f ./docker-compose.db.yml up -d && while true; do docker exec -it router-01 bash -c "echo 'sh.status()' | mongosh --port 27017" && break || sleep 2; done