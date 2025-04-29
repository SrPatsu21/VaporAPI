docker compose -f docker-compose.db.yml up -d

docker compose wait mongo-init-db

docker compose -f docker-compose.web.yml up -d