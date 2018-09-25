const ControllerHandler = requireWrap('services/controllerHandler');
const controller = requireWrap('controllers/customer');
const express = require('express');
const router = express.Router();

// checkout the source for ControllerHandler if you
// dont understand what's going on.
const c = ControllerHandler;

// this route handles getting by id
router.get('/:id', c(controller.getById, 
  (req, res, next) => [req.params]
));

// this handles updating by id
router.put('/:id', c(controller.updateById, 
  (req, res, next) => [req.params, req.body]
));

// this route handles getting by id
router.get('/', c(controller.getAll, 
  (req, res, next) => []
));

// this route handles creation of new user
router.post('/', c(controller.create, 
  (req, res, next) => [req.body]
));

// this route handles updating of password
router.patch('/:id/password', c(controller.updatePassword,
  (req, res, next) => [req.params,req.body]
));

// export router to global scope
module.exports = router;