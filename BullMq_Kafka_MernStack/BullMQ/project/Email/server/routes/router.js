const express = require('express');
const emailQueue = require('../queues/emailQueue');

const router = express.Router();

// Endpoint to add an email job
router.post('/add', async (req, res) => {
    const { email, subject, body } = req.body;

    try {
        // Add a job to the queue
       let ress= await emailQueue.add('send-email', { email, subject, body });

       // Save job details to MongoDB
    //    const newJob = new Job({
    //     jobId: job.id,
    //     data: { email, subject, body },
    // });
    // await newJob.save();

       console.log(ress)
        res.status(200).send('Email job added successfully');
    } catch (err) {
        console.error('Error adding job:', err);
        res.status(500).send('Failed to add job');
    }
});

module.exports = router;
