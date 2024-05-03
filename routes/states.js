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

// Add the new route for /states/:state/capital
router.get('/:stateCode([A-Za-z]{2})/capital', verifyStates, statesController.getCapital);
router.get('/:stateCode([A-Za-z]{2})/nickname', verifyStates, statesController.getNickname);
router.get('/:stateCode([A-Za-z]{2})/population', verifyStates, statesController.getPopulation);
router.get('/:stateCode([A-Za-z]{2})/admission', verifyStates, statesController.getAdmission);

module.exports = router;
