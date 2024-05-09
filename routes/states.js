const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');
const verifyStates = require('../middleware/verifyStates');

router.route('/')
    .get(statesController.getAllStates)

// GET Route for /states/:stateCode
router.get('/:stateCode', verifyStates, statesController.getState);

// Add the new route for /states/:state/?
router.get('/:stateCode/capital', verifyStates, statesController.getCapital);
router.get('/:stateCode/nickname', verifyStates, statesController.getNickname);
router.get('/:stateCode/population', verifyStates, statesController.getPopulation);
router.get('/:stateCode/admission', verifyStates, statesController.getAdmission);
router.get('/:stateCode/funfact', verifyStates, statesController.getFunFact);

// Post
router.post('/:stateCode/funfact', verifyStates, statesController.createState);

//Patch
router.patch('/:stateCode/funfact', verifyStates, statesController.updateFunFact);

//Delete
router.delete('/:stateCode/funfact', verifyStates, statesController.deleteFunFact);

module.exports = router;
