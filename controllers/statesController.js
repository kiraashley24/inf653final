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
        return res.status(400).json({ 'message': 'State code and fun facts are required' });
    }

    if (!Array.isArray(req.body.funfacts)) {
        return res.status(400).json({ 'message': 'Fun facts should be provided as an array' });
    }

    try {
        let state = await State.findOne({ stateCode: req.body.stateCode }).exec();

        if (!state) {
            state = await State.create({
                stateCode: req.body.stateCode,
                funFacts: req.body.funfacts
            });
        } else {
            state.funfacts = [...state.funfacts, ...req.body.funFacts];
            await state.save();
        }

        res.status(201).json(state);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Internal server error' });
    }
}


const updateState = async (req, res) => {
    if (!req?.body?.stateCode) {
        return res.status(400).json({ 'message': 'State code is required.' });
    }

    const state = await State.findOne({ stateCode: req.body.stateCode }).exec();
    if (!state) {
        return res.status(204).json({ "message": `No state matches state code ${req.body.stateCode}.` });
    }
    if (req.body?.funFacts) state.funFacts = req.body.funFacts;
    const result = await state.save();
    res.json(result);
}

const deleteState = async (req, res) => {
    if (!req?.body?.stateCode) return res.status(400).json({ 'message': 'State code required.' });

    const state = await State.findOne({ stateCode: req.body.stateCode }).exec();
    if (!state) {
        return res.status(204).json({ "message": `No state matches state code ${req.body.stateCode}.` });
    }
    const result = await state.deleteOne(); //{ stateCode: req.body.stateCode }
    res.json(result);
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
            ...(stateFromMongo && stateFromMongo.funFacts.length > 0 ? { funFacts: stateFromMongo.funFacts } : {}) // Add funFacts only if they exist
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

        if (!stateData || !stateData.funFacts || stateData.funFacts.length === 0) {
            const message = stateName ? `No fun facts found for ${stateName}.` : 'No fun facts found for this state.';
            return res.status(404).json({ message });
        }

        const randomIndex = Math.floor(Math.random() * stateData.funFacts.length);
        const randomFunFact = stateData.funFacts[randomIndex];

        res.json({ state: stateData.state, funfact: randomFunFact });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports = {
    getAllStates,
    createState,
    updateState,
    deleteState,
    getState,
    getCapital, 
    getNickname, 
    getPopulation,
    getAdmission, 
    getFunFact
};