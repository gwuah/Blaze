const UpdatePasswordSchema = require('../schema/updatePasswordSchema');
const {customer:Adapter} = require('../../../services/Axel');
const ObjectIdSchema = requireWrap('shared/vSchemas/objectId');
const BodySchemaUpdate = require('../schema/bodySchemaUpdate');
const BodySchema = require('../schema/bodySchema');
const Zeus = require('../../../services/Zeus');

const {sendEmail, emailTemplates} = require('../../../utilities');
const {domainmanager} = require('../../../services/Axel')

/* i'm intentionally ignoring es6's ability to pass only the 
* key when both the key and value have the same name.
* Everything is configuration based, we will scale.
*/

class Controller extends Zeus {
  constructor(a,b) {
    super({...a},{...b})
  }

  async createAndSendEmails(body) {
    const managers = await domainmanager.getAll();
    const emailsOfManagers = managers.map(manager => manager.email);
  
    return this.create(body).then(result => {
      const {data:customer} = result;
      
      sendEmail({
        to: emailsOfManagers,
        subject: 'New BorlaSpecific Customer',
        html: emailTemplates.customerOnboarding(customer)
      })
  
      return result
    })
  }
}

const CustomerController = new Controller({
  EntityName: 'Customer',
  Adapter: Adapter
}, {
  BodySchema: BodySchema,
  ObjectIdSchema: ObjectIdSchema,
  BodySchemaUpdate: BodySchemaUpdate,
  UpdatePasswordSchema: UpdatePasswordSchema
});

// shorten that long thing ..lol
const CC = CustomerController;

/* So since the methods belonging to Zeus are promises,
* they tend to lose their context of this. So we have to
* bind Controller back to it, just like it's done in
* React.js. [idk if they return promises though]
*/

module.exports = {
  getById: CC.getById.bind(CC),
  create: CC.createAndSendEmails.bind(CC),
  getAll: CC.getAll.bind(CC),
  updateById: CC.updateById.bind(CC),
  updatePassword: CC.updatePassword.bind(CC)
};

