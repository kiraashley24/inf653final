const State = require('../model/State');

const verifyStates = async (req, res, next) => {
    const { stateCode } = req.params;

    if (!stateCode) {
        return res.status(400).json({ message: 'State code is required.' });
    }

    try {
        const state = await State.findOne({ stateCode });
        if (!state) {
            return res.status(404).json({ message: 'State not found.' });
        }
        req.stateCode = stateCode; // Attach the state code to the request object
        next(); // Call next middleware
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = verifyStates;
