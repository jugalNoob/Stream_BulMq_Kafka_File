const Task = require('../models/task');

exports.getAllTasks = async () => {
  return await Task.find();
};

exports.getTaskById = async (id) => {
  return await Task.findById(id);
};
