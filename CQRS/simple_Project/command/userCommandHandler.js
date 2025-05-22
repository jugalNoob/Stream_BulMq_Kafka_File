const User = require('../models/user');

exports.createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};
