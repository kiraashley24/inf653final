const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');
const verifyStates = require('../middleware/verifyStates');

router.route('/')
    .get(statesController.getAllStates)
    .post(statesController.createState);

router.route('/:stateCode')  // Use stateCode instead of state
    .get(verifyStates, statesController.getState)
    .put(verifyStates, statesController.updateState)
    .delete(verifyStates, statesController.deleteState);


module.exports = router;
