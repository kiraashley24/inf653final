const State = require('../model/State');

const getAllStates = async (req, res) => {
    try {
        // Read the statesData.json file
        const statesData = require('../model/statesData.json');

        // Check if the statesData object exists and is not empty
        if (!statesData || Object.keys(statesData).length === 0) {
            return res.status(204).json({ 'message': 'No states found.' });
        }

        // Since statesData contains a single state object, wrap it in an array
        const states = [statesData];

        // Send the states as the response
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
    if (!req?.params?.stateCode) return res.status(400).json({ 'message': 'State code required.' });

    const state = await State.findOne({ stateCode: req.params.stateCode }).exec();
    if (!state) {
        return res.status(204).json({ "message": `No state matches state code ${req.params.stateCode}.` });
    }
    res.json(state);
}

module.exports = {
    getAllStates,
    createState,
    updateState,
    deleteState,
    getState
}
