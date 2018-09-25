const utils = require('../utilities');
const mongoose = require('mongoose');
const {omit} = require('lodash');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  name: { type: String, required: true },
  telephone: { type: String, required: true, unique: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  salt: {type: String },
  role: {type: String, default: 'CUSTOMER', uppercase: true}
}, {timestamps: true});

customerSchema.methods.validatePassword = function(password) {
  /* tiny line to help use with password validation */
  return utils.validatePassword(password, this)
};

customerSchema.methods.toJSON = function() {
  /* we clean up the object we are returning */
	const customer = this;
  const userObject = customer.toObject();
  
	return omit(userObject, ["password", "hash", "salt"])
}

customerSchema.pre('save', async function(next) {
  /* setup a pre save hook to hash and save password */
  const customer = this;

  if (!customer.isModified('password')) { 
    return next()
  }

  customer.salt = utils.genSalt();
  customer.password = await utils.hashPassword(customer.password, customer.salt);

  next()

});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;