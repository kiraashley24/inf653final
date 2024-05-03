const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: {
        type: [String],
        default: []
    }
});


module.exports = mongoose.model('State', stateSchema);



/*
{"stateCode": "NE", "funFacts": "Also known as the Cornhusker State"}
{
    "stateCode": "CO",
    "funfacts": [
        "There are so many 14ers you can climb!"
    ]
}
*/