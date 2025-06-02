const mongoose = require('mongoose');
const shortid = require('shortid'); // Import shortid library
const jobSchema = new mongoose.Schema({

    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    createdAt: { type: Date, default: Date.now },
    shortId: { type: String, unique: true }, // Ensure shortId is unique
 
});

const Register = mongoose.model("Url", jobSchema);

module.exports = Register;