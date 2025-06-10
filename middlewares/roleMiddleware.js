const user = require('../models/User')
const verifyRole = (roles) => (req, res, next) => {
  //console.log(roles)
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ error: 'Accès interdit pour ce rôle.' });
    }
    next();
  };
  module.exports = verifyRole;