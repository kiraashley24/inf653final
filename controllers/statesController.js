const State = require('../model/State');

// GET /states/
const getAllStates = async (req, res) => {
    try {
        const statesData = require('../model/statesData.json');
        const { contig } = req.query;
        
         // Check if the statesData object exists and is not empty
         if (!statesData || Object.keys(statesData).length === 0) {
            return res.status(204).json({ 'message': 'No states found.' });
        }
        let states = Object.values(statesData);
        // Filter states based on the contig param
        if (contig === 'true') {
            states = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
        } else if (contig === 'false') {
            states = states.filter(state => state.code === 'AK' || state.code === 'HI');
        }
        // Send the filtered states as response
        res.json(states);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Internal server error' });
    }
};

// GET /states/:stateCode
const getState = async (req, res) => {
    let { stateCode } = req.params;
    if (!stateCode) {
        return res.status(400).json({ message: 'State code is required.' });
    }

    // Convert stateCodes to all match
    stateCode = stateCode.toUpperCase();

    try {
        // Fetch state data from statesData.json
        const statesData = require('../model/statesData.json');
        const state = statesData.find(state => state.code.toUpperCase() === stateCode);
        if (!state) {
            return res.status(404).json({ message: 'State not found.' });
        }

        // Query MongoDB for funfacts
        const dbStates = await State.find( {stateCode}).exec();

        // Iterate through JSON data
        const funfacts = [];
        statesData.forEach(stateData => {
            const dbState = dbStates.find(dbState => dbState.stateCode === stateData.code);
            if (dbState) {
                funfacts.push(...dbState.funfacts);
            }
        });

        // Combine the data
        const combinedStateData = { ...state, funfacts: funfacts };

        // Send the combined state data as the response
        res.json(combinedStateData);
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
    // Convert stateCodes to all match
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
    // Convert stateCodes to all match
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
    // Convert stateCodes to all match
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
    // Convert stateCodes to all match
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
    // Convert stateCodes to all match
    stateCode = stateCode.toUpperCase(); 
    try {
        const statesData = require('../model/statesData.json');
        const state = statesData.find(state => state.code.toUpperCase() === stateCode);
        const stateName = state ? state.state : null;
        const stateData = await State.findOne({ stateCode }).exec();
        if (!stateData || !stateData.funfacts || stateData.funfacts.length === 0) {
            const message = stateName ? `No Fun Facts found for ${stateName}` : 'No Fun Facts found for this state';
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
    const { stateCode } = req.params;
    const { funfacts } = req.body;

    if (!funfacts) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }
    if (!Array.isArray(funfacts)) {
        return res.status(400).json({ 'message': 'State fun facts value must be an array' });
    }
    try {
        let state = await State.findOne({ stateCode }).exec();
        if (!state) {
            state = await State.create({
                stateCode,
                funfacts
            });
        } else {
            state.funfacts = [...state.funfacts, ...funfacts];
            await state.save();
        }
        console.log('Created state:', state); // Log created state

        // Retrieve the updated state from the database for correct order
        const updatedState = await State.findById(state._id).exec();
        res.status(201).json(updatedState);
    } catch (err) {
        console.error(err); 
        res.status(500).json({ 'message': 'Internal server error' });
    }
};




// PATCH /states/:state/funfact
const updateFunFact = async (req, res) => {
    const { stateCode } = req.params;
    const { index, funfact } = req.body;

    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }
    if (!funfact) {
        return res.status(400).json({ message: 'State fun fact value required' });
    }

    // Convert stateCode to match
    const upperStateCode = stateCode.toUpperCase();
    try {
        // Find the state in the database
        let state = await State.findOne({ stateCode: upperStateCode }).exec();
        if (!state) {
            const statesData = require('../model/statesData.json');
            const stateFromData = statesData.find(state => state.code.toUpperCase() === upperStateCode);
            const stateName = stateFromData ? stateFromData.state : null;
            return res.status(404).json({ message: `No Fun Facts found for ${stateName}` });
        }

        // Adjust index to match zero-based array index
        const adjustedIndex = parseInt(index) - 1;
        // Check if the index is within the funfacts array
        if (adjustedIndex < 0 || adjustedIndex >= state.funfacts.length) {
            const statesData = require('../model/statesData.json');
            const stateFromData = statesData.find(state => state.code.toUpperCase() === upperStateCode);
            const stateName = stateFromData ? stateFromData.state : null;
            if (!state.funfacts || state.funfacts.length === 0) {
                return res.status(404).json({ message: `No Fun Facts found for ${stateName}` });
            } else {
                return res.status(404).json({ message: `No Fun Fact found at that index for ${stateName}` });
            }
        }

        // Update the funfact at the specified index
        state.funfacts[adjustedIndex] = funfact;
        // Save the updated state
        const updatedState = await state.save();
        // Return the updated state
        res.json(updatedState);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// DELETE /states/:state/funfact
const deleteFunFact = async (req, res) => {
    const { stateCode } = req.params;
    const { index } = req.body;
    if (!stateCode || !index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }
    // Convert stateCode to match
    const upperStateCode = stateCode.toUpperCase();
    try {
        const statesData = require('../model/statesData.json');
        const state = statesData.find(state => state.code.toUpperCase() === upperStateCode);
        const stateName = state ? state.state : null;
        // Find the state in the database
        let dbState = await State.findOne({ stateCode: upperStateCode }).exec();
        if (!dbState) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateName}` });
        }
        // Adjust index to match zero-based array index
        const adjustedIndex = parseInt(index) - 1;
        // Check if the index is in funfacts
        if (adjustedIndex < 0 || adjustedIndex >= dbState.funfacts.length) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${stateName}` });
        }
        // Remove the funfact at the specific index
        dbState.funfacts = dbState.funfacts.filter((_, i) => i !== adjustedIndex);
        // Save the updated state
        const updatedState = await dbState.save();
        // Return the updated state with proper order
        const { _id, stateCode, funfacts, __v } = updatedState;
        res.json({ _id, stateCode, funfacts, __v });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
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