# API and MONGODB

## Run project

### .env

You need to copy the file `.env.exemple` and **rename** to `.env`.
Inside that file are all the configurations you will need to run.
You must change the `JWT_SECRET`, `JWT_REFRESH_SECRET` and `MONGO_URI` that need to match with yours.

### run npm

for production:
```
sudo npm run prod
```

for dev mode:
```
sudo npm run dev
```