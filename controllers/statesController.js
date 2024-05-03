const State = require('../model/State');

const getAllStates = async (req, res) => {
    try {
        const statesData = require('../model/statesData.json');
        const { contig } = req.query;

        // Check if the statesData object exists and is not empty
        if (!statesData || Object.keys(statesData).length === 0) {
            return res.status(204).json({ 'message': 'No states found.' });
        }

        let states = Object.values(statesData);

        // Filter states based on the 'contig' query parameter
        if (contig === 'true') {
            states = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
        } else if (contig === 'false') {
            states = states.filter(state => state.code === 'AK' || state.code === 'HI');
        }

        // Send the filtered states as the response
        res.json(states);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Internal server error' });
    }
}


const createState = async (req, res) => {
    if (!req?.body?.stateCode || !req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }

    if (!Array.isArray(req.body.funfacts)) {
        return res.status(400).json({ 'message': 'Fun facts should be provided as an array' });
    }

    try {
        let state = await State.findOne({ stateCode: req.body.stateCode }).exec();

        if (!state) {
            state = await State.create({
                stateCode: req.body.stateCode,
                funfacts: req.body.funfacts
            });
        } else {
            state.funfacts = [...state.funfacts, ...req.body.funfacts];
            await state.save();
        }

        console.log('Created state:', state); // Log the created state

        res.status(201).json(state);
    } catch (err) {
        console.error(err); // Log the error
        res.status(500).json({ 'message': 'Internal server error' });
    }
}



const getState = async (req, res) => {
    let { stateCode } = req.params;

    if (!stateCode) {
        return res.status(400).json({ message: 'State code is required.' });
    }

    // Convert stateCode to uppercase
    stateCode = stateCode.toUpperCase();

    try {
        const statesData = require('../model/statesData.json');
        const stateData = statesData.find(state => state.code.toUpperCase() === stateCode);

        if (!stateData) {
            return res.status(404).json({ message: 'State not found.' });
        }

        let stateFromMongo = await State.findOne({ stateCode }).exec();

        const mergedStateData = {
            ...stateData,
            ...(stateFromMongo && stateFromMongo.funfacts.length > 0 ? { funfacts: stateFromMongo.funfacts } : {}) // Add funFacts only if they exist
        };

        res.json(mergedStateData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

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


const getAdmission = (req, res) => {
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

        res.json({ state: state.state, admitted: state.admission_date });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

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

const updateFunFact = async (req, res) => {
    const { stateCode } = req.params;
    const { index, funfact } = req.body;

    if (!stateCode) {
        return res.status(400).json({ message: 'State code is required.' });
    }
    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required.' });
    }
    if (!funfact) {
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
        state.funfacts[adjustedIndex] = funfact;

        // Save the updated state
        const updatedState = await state.save();

        // Return the updated state
        res.json(updatedState);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

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


   