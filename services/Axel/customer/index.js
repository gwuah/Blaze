const CustomerModel = requireWrap('models/Customer');
const Nexus = requireWrap('shared/Nexus');

class Customer extends Nexus {
  constructor(Model) {
    super(Model)
  }

  /* so from here, we can extend it and implement any new
  * method we desire. []
  */
}

module.exports = new Customer(CustomerModel);