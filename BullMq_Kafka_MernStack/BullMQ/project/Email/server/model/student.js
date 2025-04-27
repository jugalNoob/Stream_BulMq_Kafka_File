const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['waiting', 'completed', 'failed'], default: 'waiting' },
    data: { type: Object, required: true },
    result: { type: Object },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    failedAt: { type: Date },
    error: { type: String }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
