const verifyStates = async (req, res, next) => {
    let { stateCode } = req.params;

    if (!stateCode) {
        return res.status(400).json({ message: 'State code is required.' });
    }

    stateCode = stateCode.toUpperCase(); // Convert to uppercase

    try {
        const statesData = require('../model/statesData.json');
        const stateCodes = statesData.map(state => state.code.toUpperCase());

        if (!stateCodes.includes(stateCode)) {
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
