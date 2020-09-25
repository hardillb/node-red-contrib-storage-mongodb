
const mongoose = require('mongoose');

const Flows = require('./models/flows');
const Credentials = require('./models/credentials');
const Settings = require('./models/settings');
const Sessions = require('./models/sessions');
const Library = require('./models/library');

var mongoose_options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

var settings;
var appname;

const mongoStorage = {
  init: function(nrSettings) {
    settings = nrSettings.mongodbSettings || {};

    if (!settings) {
      var err = Promise.reject("No MongoDB settings for flow storage found");
      err.catch(err => {});
      return err;
    }

    appname = settings.appname;

    return new Promise(function(resolve, reject){
      mongoose.connect(settings.mongoURI, mongoose_options)
      .then(() => {
        // console.log("connected to storage db");
        resolve();
      })
      .catch(err => {
        reject(err);
      });
    })
  },
  getFlows: function() {
    return new Promise(function(resolve, reject) {
      Flows.findOne({appname: appname}, function(err, flows){
        if (err) {
          reject(err);
        } else {
          if (flows){
            resolve(flows.flow);
          } else {
            resolve([]);
          }
        }
      })
    })
  },
  saveFlows: function(flows) {
    return new Promise(function(resolve, reject) {
      Flows.findOneAndUpdate({appname: appname},{flow: flows}, {upsert: true}, function(err,flow){
        if (err) {
          reject(err)
        } else {
          resolve();
        }
      })
    })
  },
  getCredentials: function() {
    return new Promise(function(resolve, reject) {
      Credentials.findOne({appname: appname}, function(err, creds){
        if (err) {
          reject(err);
        } else {
          if (creds){
            resolve(JSON.parse(creds.credentials));
          } else {
            resolve({});  
          }
        }
      })
    })
  },
  saveCredentials: function(credentials) {
    return new Promise(function(resolve, reject) {
      Credentials.findOneAndUpdate({appname: appname},{credentials: JSON.stringify(credentials)}, {upsert: true}, function(err,credentials){
        if (err) {
          reject(err)
        } else {
          resolve();
        }
      })
    })
  },
  getSettings: function() {
    // console.log("looking for settings")
    return new Promise(function(resolve, reject) {
      Settings.findOne({appname: appname}, function(err, setts){
        if (err) {
          reject(err);
        } else {
          if (setts) {
            // console.log("settings found");
            resolve(setts.settings);
          } else {
            resolve({});
          }
        }
      })
    })
  },
  saveSettings: function(settings) {
    return new Promise(function(resolve, reject) {
      Settings.findOneAndUpdate({appname: appname},{settings: settings}, {upsert: true, useFindAndModify: false}, function(err,settings){
        if (err) {
          reject(err)
        } else {
          resolve();
        }
      })
    })
  },
  getSessions: function() {
    // console.log("looking for session");
    return new Promise(function(resolve, reject) {
      Sessions.findOne({appname: appname}, function(err, sessions){
        if (err) {
          reject(err);
        } else {
          if (sessions) {
            // console.log("found session")
            resolve(sessions.sessions);
          } else {
            resolve({});
          }
        }
      })
    })
  },
  saveSessions: function(sessions) {
    return new Promise(function(resolve, reject) {
      Sessions.findOneAndUpdate({appname: appname},{sessions: sessions}, 
        {upsert: true, useFindAndModify: false}, 
        function(err,sessions){
          if (err) {
            reject(err)
          } else {
            resolve();
          }
        })
    })
  },
  getLibraryEntry: function(type,name) {
    if (name == "") {
      name = "/"
    } else if (name.substr(0,1) != "/") {
      name = "/" + name
    }

    return new Promise(function(resolve,reject) {
      Library.findOne({appname: appname, type: type, name: name}, function(err, file){
        if (err) {
          reject(err);
        } else if (file) {
          resolve(file.body);
        } else {
          var reg = new RegExp('^' + name , "");
          Library.find({appname: appname, type: type, name: reg }, function(err, fileList){
            if (err) {
              reject(err)
            } else {
              var dirs = [];
              var files = [];

              for (var i=0; i<fileList.length; i++) {
                var n = fileList[i].name;
                n = n.replace(name, "");
                if (n.indexOf('/') == -1) {
                  var f = fileList[i].meta;
                  f.fn = n;
                  files.push(f);
                } else {
                  n = n.substr(0,n.indexOf('/'))
                  dirs.push(n);
                }
              }
              dirs = dirs.concat(files);
              resolve(dirs);
            }
          })
          
        }
      })
    });
  },
  saveLibraryEntry: function(type,name,meta,body) {
    return new Promise(function(resolve,reject) {
      var p = name.split("/");    // strip multiple slash
      p = p.filter(Boolean);
      name = p.slice(0, p.length).join("/")
      if (name != "" && name.substr(0, 1) != "/") {
        name = "/" + name;
      }
      Library.findOneAndUpdate({appname: appname, name: name}, 
        {name:name, meta:meta, body:body, type: type},
        {upsert: true, useFindAndModify: false},
        function(err, library){
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
    });
  }
};


module.exports = mongoStorage;