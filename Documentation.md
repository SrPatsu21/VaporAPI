# API and MONGODB

## Run project

### .env

You need to copy the file `.env.exemple` and **rename** to `.env`.
Inside that file are all the configurations you will need to run.
You must change the `JWT_SECRET`, `JWT_REFRESH_SECRET` and `MONGO_URI` that need to match with yours.

### API cert

Run this command to create a Self-Signed SSL cert:
```
mkdir ./certs
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout ./certs/privkey.pem \
  -out ./certs/fullchain.pem \
  -subj "/CN=localhost"
```

### run npm

for production:
```
sudo npm run prod
```

for dev mode:
```
sudo npm run dev
```