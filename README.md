# node-red-contrib-storage-mongodb

A storage plugin for Node-RED that uses MongoDB to store flows, library entries and settings

## Setup

Add the following to `settings.js`

```
...
storageModule: require('node-red-contrib-storage-mongodb'),
mongodbSettings: {
  mongoURI: process.env["MONGO_URL"],
  appname: process.env["APP_NAME"]
},
...
```

Where `mongoURI` is the location of a MongoDB database and `appname` is a unique identifier for this instance of Node-RED to allow multiple instances to use the same DB.

It will use a collections with the following names

 - flow
 - credentials
 - settings
 - sessions
 - library