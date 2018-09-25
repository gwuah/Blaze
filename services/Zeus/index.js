const {runValidations} = require('../../utilities');
const {ValidationFailedError} = require('../../shared/customErrors');

function Zeus({
  EntityName, 
  Adapter
}, schemas = {
  BodySchema,
  ObjectIdSchema,
  BodySchemaUpdate,
  updatePasswordSchema
}) {
  if (!EntityName) {
    throw new Error('Required <entityName> prop not present.')
  }
  if (!Adapter) {
    throw new Error('Required <Adapter> prop not present.')
  }
  this.db = Adapter;
  this.name = EntityName;

  /* plugin all those validation schema's */
  Object.keys(schemas).forEach(schema => {
    this[schema] = schemas[schema];
  })
};

Zeus.prototype.getById = async function(params) {
  const {id} = params;
  let cleanId = undefined;

  if (this.ObjectIdSchema) {
    const {error, details} = await runValidations([
      this.ObjectIdSchema.validate(id)
    ])
    
    if (error) {
      throw new ValidationFailedError({
        errors:details
      })
    } else {
      /* check the source for runValidations
       * but essentially, we passed one validation
       * to the factory, so we extract from index [0]
      */
      cleanId = details[0]
    }
  }

  const data = await this.db.getById(cleanId);

  if (!data) {
    return {message: `${this.name} document not found.`, code: 404}
  }

  return {data:data, message: `${this.name} retrieved successfully`, code: 200}
}

Zeus.prototype.create = async function(body) {

  let cleanBody = {};

  if (this.BodySchema) {
    const {error, details} = await runValidations([
      this.BodySchema.validate(body, {abortEarly: false})
    ])

    if (error) {
      throw new ValidationFailedError({
        errors:details
      })
    } else {
      /* check the source for runValidations
       * but essentially, we passed one validation
       * to the factory, so we extract from index [0]
      */
      cleanBody = details[0]
    }
  }

  const data = await this.db.create(cleanBody);

  return {data:data, message: `${this.name} created successfully`, code: 201}
}

Zeus.prototype.updateById = async function(params, body) {
  let {id} = params;
  var cleanBody = {};

  if (this.BodySchemaUpdate) {
    const {error, details} = await runValidations([
      this.ObjectIdSchema.validate(id),
      this.BodySchemaUpdate.validate(body, {abortEarly: false})
    ])

    if (error) {
      console.log(error)
      throw new ValidationFailedError({
        errors:details
      })
    } else {

      /* check the source for runValidations
       * but essentially, we passed one validation
       * to the factory, so we extract from index [0]
      */
     var [cleanId, cleanBody] = details;
    }
  }

  const data = await this.db.updateById(cleanId,cleanBody);

  return {data:data, message: `${this.name} updated successfully`, code: 200}
}

Zeus.prototype.updatePassword = async function(params, body) {
  let {id} = params;
  let newPassword;

  if (this.UpdatePasswordSchema) {
    const {error, details} = await runValidations([
      this.ObjectIdSchema.validate(id),
      this.UpdatePasswordSchema.validate(body, {abortEarly: false})
    ])

    if (error) {
      throw new ValidationFailedError({
        errors:details
      })
    } else {

      /* check the source for runValidations
       * but essentially, we passed one validation
       * to the factory, so we extract from index [0]
      */
     var [cleanId, cleanBody] = details;
     newPassword = cleanBody['password'];
    }
  }

  const data = await this.db.updatePassword(cleanId,newPassword);

  return {data:data, message: `${this.name} updated successfully`, code: 200}
}

Zeus.prototype.getAll = async function() {
  const data = await this.db.getAll();

  return {data:data, message: `${this.name} documents retrieved successfully`, code: 200}
}

Zeus.prototype.updateArrayProp = async function(propName, params, body) {
  let {id} = params;

  if (this.BodySchemaUpdate) {
    const {error, details} = await runValidations([
      this.ObjectIdSchema.validate(id),
      this.BodySchemaUpdate.validate(body, {abortEarly: false})
    ])

    if (error) {
      throw new ValidationFailedError({
        errors:details
      })
    } else {

      /* check the source for runValidations
       * but essentially, we passed one validation
       * to the factory, so we extract from index [0]
      */
     var [cleanId, cleanBody] = details;
    }
  }

  const data = await this.db.updateArrayProp(cleanId, propName, cleanBody[propName]);

  return {data:data, message: `${this.name} updated successfully`, code: 200}

}

Zeus.prototype.queryByRelation = async function(relation, param) {
  let {id} = param;

  if (this.ObjectIdSchema) {
    const {error, details} = await runValidations([
      this.ObjectIdSchema.validate(id),
    ])

    if (error) {
      throw new ValidationFailedError({
        errors:details
      })
    } else {

      /* check the source for runValidations
       * but essentially, we passed one validation
       * to the factory, so we extract from index [0]
      */
     var [cleanId] = details;
    }
  }

  let cleanQuery = {[relation]: cleanId}

  const data = await this.db.query(cleanQuery);

  return {data:data, message: `${this.name} related to ${relation} retrieved successfully`, code: 200}


}

module.exports = Zeus;