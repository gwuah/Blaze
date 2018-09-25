const Axel = require('../../services/Axel');

/* 
* Axel's direct props are all lowercase.;
* Hence, this conversion. 👻
*/
const mapRoleToAdapter = function(role) {
  let userRole = role.toLowerCase();
  return Axel[userRole];
};

const hasPermission = function(role, validRoles=[]) {
  return validRoles.includes(role.toLowerCase())
}

const validateUser = async function({
  adapter, token
}) {
  const user = {auth} = await adapter.findByToken(token);
  if (user && auth.token == token && auth.token.expiry > Date.now()) {
    return {status:true, data: user}
  } else {
    return {status:false}
  }
}

module.exports = {
  mapRoleToAdapter,
  hasPermission,
  validateUser
}