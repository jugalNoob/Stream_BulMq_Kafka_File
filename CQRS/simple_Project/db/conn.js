const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect('mongodb://localhost:27017/cqrs_example', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('MongoDB connected'));
};
