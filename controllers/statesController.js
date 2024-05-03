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
    if (!req?.body?.stateCode || !req?.body?.funFacts) {
        return res.status(400).json({ 'message': 'State code and fun facts are required' });
    }

    try {
        const result = await State.create({
            stateCode: req.body.stateCode,
            funFacts: req.body.funFacts
        });

        res.status(201).json(result);
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
    const { stateCode } = req.params;

    try {
        const statesData = require('../model/statesData.json');
        const stateData = statesData.find(state => state.code.toUpperCase() === stateCode);

        if (!stateData) {
            return res.status(404).json({ message: 'State not found.' });
        }

        let stateFromMongo = await State.findOne({ stateCode }).exec();

        const mergedStateData = {
            ...stateData,
            funFacts: stateFromMongo ? stateFromMongo.funFacts : [] // Provide an empty array if no fun facts are found
        };

        res.json(mergedStateData);
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
    getState
}
