const State = require('../model/State');

const verifyStates = async (req, res, next) => {
    const { state } = req.params;

    if (!state) {
        return res.status(400).json({ message: 'State code is required.' });
    }

    try {
        const foundState = await State.findOne({ stateCode: state });
        if (!foundState) {
            return res.status(404).json({ message: 'State not found.' });
        }
        req.state = foundState; // Attach the state object to the request object
        next(); // Call next middleware
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = verifyStates;
