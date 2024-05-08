const verifyStates = async (req, res, next) => {
    let { stateCode } = req.params;

    if (!stateCode) {
        return res.status(400).json({ message: 'State code is required.' });
    }

    // Convert stateCode to uppercase
    stateCode = stateCode.toUpperCase();

    try {
        const statesData = require('../model/statesData.json');
        const stateCodes = statesData.map(state => state.code.toUpperCase());

        // Check if stateCode is valid
        const isValidStateCode = stateCodes.find(code => code === stateCode);
        if (!isValidStateCode) {
            return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
        }
        // Attach the stateCode to the request object
        req.stateCode = stateCode;

        next(); // Call next middleware
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = verifyStates;
