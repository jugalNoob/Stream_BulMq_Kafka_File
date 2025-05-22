const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  profile: {
    age: Number,
    bio: String,
  },
});

module.exports = mongoose.model('User', UserSchema);
