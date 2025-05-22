const User = require('../models/user');

exports.getUserProfile = async (id) => {
  return await User.findById(id).select('name email profile');
};
