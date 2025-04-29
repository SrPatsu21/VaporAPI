docker compose -f docker-compose.db.yml up -d configdb-replica0 configdb-replica1 configdb-replica2 shard0-replica0 shard0-replica1 shard1-replica0 shard1-replica1 mongos-router0

docker compose wait mongo-init-db

docker compose -f docker-compose.web.yml up -d