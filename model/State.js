const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    funFacts: {
        type: [String],
        default: []
    }
});


module.exports = mongoose.model('State', stateSchema);



/*
{"stateCode": "NE", "funFacts": "Also known as the Cornhusker State"}*/