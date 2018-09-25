// a custom wrapper for require
// spares me < ../../../../ >
const path = require('path');

global.requireWrap = function(dirpath) {
  return require(path.join(__dirname, dirpath))
};

const utils = require('./utilities');
const config = require('./config');
const server = require('./app');

const handler = {

  connectToDatabase: function(env) {
    return new Promise((res, rej) => {
      if (process.env.NODE_ENV == 'development') {
        return utils.connectToDatabase(config.DEV_DB_URL)
          .then(res).catch(rej)
      } else if (process.env.NODE_ENV == 'production') {
        return utils.connectToDatabase(config.PROD_DB_URL)
          .then(res).catch(rej)
      }
    })
  },

  init: function(config) {
    
    return this.connectToDatabase(config).then((url) => {
      return server.listen(config.PORT, () => {
        console.log(`< 👻  running ==> ${config.PORT} >`)
      });
    })
  },

  stop: function(cb) {
    return server.close(cb)
  }
}

// initialise application
handler.init(config)

module.exports = handler;