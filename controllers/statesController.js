const State = require('../model/State');

// GET /states/
const getAllStates = async (req, res) => {
    try {
        const statesData = require('../model/statesData.json');

        // Get all states with funfacts from MongoDB
        const statesWithFunFacts = await State.find({ funfacts: { $exists: true, $ne: [] } }).exec();

        // Merge funfacts from MongoDB with statesData
        let states = statesData.map(state => {
            const stateWithFunFacts = statesWithFunFacts.find(s => s.stateCode === state.code);
            if (stateWithFunFacts) {
                return { ...state, funfacts: stateWithFunFacts.funfacts };
            } else {
                return state;
            }
        });

        // Send the merged states as response
        res.status(200).json(states);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


// GET /states/:stateCode
const getState = async (req, res) => {
    let { stateCode } = req.params;
    if (!stateCode) {
        return res.status(400).json({ message: 'State code is required.' });
    }
    // Convert stateCode to uppercase
    stateCode = stateCode.toUpperCase();  // or stateCode.toLowerCase();
    try {
        const statesData = require('../model/statesData.json');
        const state = statesData.find(state => state.code.toUpperCase() === stateCode);
        if (!state) {
            return res.status(404).json({ message: 'State not found.' });
        }
        res.json(state);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};



///GET/states/:state/capital
const getCapital = (req, res) => {
    let { stateCode } = req.params;

    if (!stateCode) {
        return res.status(400).json({ message: 'State code is required.' });
    }
    // Convert stateCode to uppercase
    stateCode = stateCode.toUpperCase();
    try {
        const statesData = require('../model/statesData.json');
        const state = statesData.find(state => state.code.toUpperCase() === stateCode);
        if (!state) {
            return res.status(404).json({ message: 'State not found.' });
        }
        res.json({ state: state.state, capital: state.capital_city });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

//GET/states/:state/nickname
const getNickname = (req, res) => {
    let { stateCode } = req.params;
    if (!stateCode) {
        return res.status(400).json({ message: 'State code is required.' });
    }
    // Convert stateCode to uppercase
    stateCode = stateCode.toUpperCase();
    try {
        const statesData = require('../model/statesData.json');
        const state = statesData.find(state => state.code.toUpperCase() === stateCode);
        if (!state) {
            return res.status(404).json({ message: 'State not found.' });
        }
        res.json({ state: state.state, nickname: state.nickname });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

//GET/states/:state/population
const getPopulation = (req, res) => {
    let { stateCode } = req.params;
    if (!stateCode) {
        return res.status(400).json({ message: 'State code is required.' });
    }
    // Convert stateCode to uppercase
    stateCode = stateCode.toUpperCase();
    try {
        const statesData = require('../model/statesData.json');
        const state = statesData.find(state => state.code.toUpperCase() === stateCode);
        if (!state) {
            return res.status(404).json({ message: 'State not found.' });
        }
        // Format population number with commas
        const formattedPopulation = state.population.toLocaleString();
        res.json({ state: state.state, population: formattedPopulation });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

//GET/states/:state/admission
const getAdmission = async (req, res) => {
    let { stateCode } = req.params;
    if (!stateCode) {
        return res.status(400).json({ message: 'State code is required.' });
    }
    // Convert stateCode to uppercase
    stateCode = stateCode.toUpperCase();
    try {
        const statesData = require('../model/statesData.json');
        const state = statesData.find(state => state.code.toUpperCase() === stateCode);
        if (!state) {
            return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
        }
        res.json({ state: state.state, admitted: state.admission_date });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

//GET/states/:state/funfact
const getFunFact = async (req, res) => {
    let { stateCode } = req.params;
    if (!stateCode) {
        return res.status(400).json({ message: 'State code is required.' });
    }
    // Convert stateCode to uppercase
    stateCode = stateCode.toUpperCase(); 
    try {
        const statesData = require('../model/statesData.json');
        const state = statesData.find(state => state.code.toUpperCase() === stateCode);
        const stateName = state ? state.state : null;
        const stateData = await State.findOne({ stateCode }).exec();
        if (!stateData || !stateData.funfacts || stateData.funfacts.length === 0) {
            const message = stateName ? `No fun facts found for ${stateName}.` : 'No fun facts found for this state.';
            return res.status(404).json({ message });
        }
        const randomIndex = Math.floor(Math.random() * stateData.funfacts.length);
        const randomFunfact = stateData.funfacts[randomIndex];
        res.json({ state: stateData.state, funfact: randomFunfact });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// POST /states/:state/funfact
const createState = async (req, res) => {
    const { state } = req.params;
    if (!req?.body?.funfacts || !Array.isArray(req.body.funfacts)) {
        return res.status(400).json({ 'message': 'Fun facts should be provided as an array' });
    }
    try {
        let existingState = await State.findOne({ stateCode: state }).exec();
        if (!existingState) {
            existingState = await State.create({
                stateCode: state,
                funfacts: req.body.funfacts
            });
        } else {
            existingState.funfacts = [...existingState.funfacts, ...req.body.funfacts];
            await existingState.save();
        }
        console.log('Updated state:', existingState); // Log updated state
        res.status(201).json(existingState);
    } catch (err) {
        console.error(err); // Log error
        res.status(500).json({ 'message': 'Internal server error' });
    }
};




//PATCH/states/:state/funfact
const updateFunFact = async (req, res) => {
    const { stateCode } = req.params;
    const { index, funfacts } = req.body;
    if (!stateCode) {
        return res.status(400).json({ message: 'State code is required.' });
    }
    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required.' });
    }
    if (!funfacts) {
        return res.status(400).json({ message: 'State fun fact value required.' });
    }
    // Convert stateCode to uppercase
    const upperStateCode = stateCode.toUpperCase();
    try {
        // Find the state in the database
        let state = await State.findOne({ stateCode: upperStateCode }).exec();
        if (!state) {
            return res.status(404).json({ message: `State with code ${upperStateCode} not found.` });
        }
        // Adjust index to match zero-based array index
        const adjustedIndex = parseInt(index) - 1;
        // Check if the index is within bounds of the funfacts array
        if (adjustedIndex < 0 || adjustedIndex >= state.funfacts.length) {
            return res.status(400).json({ message: 'Invalid index provided.' });
        }
        // Update the funfact at the specified index
        state.funfacts[adjustedIndex] = funfacts;
        // Save the updated state
        const updatedState = await state.save();
        // Return the updated state
        res.json(updatedState);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

//DELETE/states/:state/funfact
const deleteFunFact = async (req, res) => {
    const { stateCode } = req.params;
    const { index } = req.body;
    if (!stateCode || !index) {
        return res.status(400).json({ message: 'State code and fun fact index value required' });
    }
    // Convert stateCode to uppercase
    const upperStateCode = stateCode.toUpperCase();
    try {
        const statesData = require('../model/statesData.json');
        const state = statesData.find(state => state.code.toUpperCase() === upperStateCode);
        const stateName = state ? state.state : null;
        // Find the state in the database
        let dbState = await State.findOne({ stateCode: upperStateCode }).exec();
        if (!dbState) {
            return res.status(404).json({ message: `State with code ${upperStateCode} not found.` });
        }
        // Adjust index to match zero-based array index
        const adjustedIndex = parseInt(index) - 1;
        // Check if the index is within bounds of the funfacts array
        if (adjustedIndex < 0 || adjustedIndex >= dbState.funfacts.length) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${stateName}.` });
        }
        // Remove the funfact at the specified index
        dbState.funfacts.splice(adjustedIndex, 1);
        // Save the updated state
        const updatedState = await dbState.save();
        // Return the updated state
        res.json(updatedState);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
module.exports = {
    getAllStates,
    createState,
    updateFunFact,
    deleteFunFact,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    getFunFact
};