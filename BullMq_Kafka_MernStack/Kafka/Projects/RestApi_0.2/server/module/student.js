const mongoose = require("mongoose");

const shortid = require('shortid'); // Import shortid library

// Define the student schema
const studentSchema = new mongoose.Schema({
    name: { type: String  ,required:true},
    email: { type: String , required:true }, //unique email address
    password: { type: String, required:true},
    date: { type: Date, default: Date.now }, // Default date time
    shortId: { type: String, unique: true }, // Ensure shortId is unique
});



const Register  = mongoose.model("Url", studentSchema);
module.exports = Register ;