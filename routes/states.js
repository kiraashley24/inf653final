const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');
const verifyStates = require('../middleware/verifyStates');

router.route('/')
    .get(statesController.getAllStates)
    .post(statesController.createState);

router.route('/:stateCode')  // Use stateCode instead of state
    .get(verifyStates, statesController.getState)
    
   

// Add the new route for /states/:state/capital
router.get('/:stateCode([A-Za-z]{2})/capital', verifyStates, statesController.getCapital);
router.get('/:stateCode([A-Za-z]{2})/nickname', verifyStates, statesController.getNickname);
router.get('/:stateCode([A-Za-z]{2})/population', verifyStates, statesController.getPopulation);
router.get('/:stateCode([A-Za-z]{2})/admission', verifyStates, statesController.getAdmission);
router.get('/:stateCode/funfact', verifyStates, statesController.getFunFact);

// Post
router.post('/:stateCode/funfact', verifyStates, statesController.createState);

//Patch
router.patch('/:stateCode([A-Za-z]{2})/funfact', verifyStates, statesController.updateFunFact);

//Delete
router.delete('/:stateCode/funfact', verifyStates, statesController.deleteFunFact);


module.exports = router;
