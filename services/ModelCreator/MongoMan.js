const utils = require('../utilities');
const mongoose = require('mongoose');
const {omit} = require('lodash');
const Schema = mongoose.Schema;

const MongoMan = function(
  modelName, 
  schema, 
  options={sensitiveData}
) {
  this.name = modelName;
  this.schema = new Schema(schema);
  this.opts = options;
}

MongoMan.prototype.init = function() {
  this.pluginMethods();
  return mongoose.model(name, this.schema)
}

MongoMan.prototype.pluginMethod = function(name, method) {
  this.schema[name] = method.bind(this.schema)
}

MongoMan.prototype.pluginMethods = function() {
  const fn1 = function() {
    
  }
}

module.exports = (function() {
  
})()


