const Task = require('../models/task');

exports.createTask = async (data) => {
  const task = new Task(data);
  return await task.save();
};

exports.updateTask = async (id, data) => {
  return await Task.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};
