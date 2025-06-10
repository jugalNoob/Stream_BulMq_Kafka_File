const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const bcrypt = require('bcryptjs');
const Register = require("../model/student"); // Update path as needed
const NotificationQueue = require("../queues/noticationQueu");




/// ---- >>> How is worker router -- Bull Mq --   MongoDb  -- >>>



// ----  >>>  Deepsea Ai   how is worker router mongodb bullMq ------->>

router.post('/signupu', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Check if user already exists
        const existingUser = await Register.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const shortId = shortid.generate();

        const newUser = new Register({
            name,
            email,
            password: hashedPassword,
            shortId,
        });

        const savedUser = await newUser.save();

        console.log(savedUser)

        // Queue welcome notification
        const message = `Welcome ${name}! Your signup was successful.`;
       const job = await NotificationQueue.add('sendEmail', { name, email, message }, {
  delay: 1000, // Wait 1 second before first processing attempt
  attempts: 5, // Retry up to 5 times if job fails
  backoff: {
    type: 'exponential', // Backoff strategy
    delay: 2000, // First retry after 2s, then 4s, 8s, 16s...
  },
  removeOnComplete: true, // Clean up successful jobs
  removeOnFail: false // Keep failed jobs for debugging (e.g., in Redis/BullBoard)
});

        res.status(201).json({ 
            success: true, 
            jobId: job.id,
            user: {
                id: savedUser.shortId,
                name: savedUser.name,
                email: savedUser.email
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Server error during signup' });
    }
});





/// --- > >>> This api code working

router.post('/signupusersss', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const shortId = shortid.generate();

        // Save user to MongoDB
        const jobDetails = new Register({
            name,
            email,
            password: hashedPassword,
            shortId,
        });

        const checkSave = await jobDetails.save();
        console.log('✅ Saved user to MongoDB:', checkSave);

        // Queue welcome notification
        const message = `Welcome ${name}! Your signup was successful.`;
        const job = await NotificationQueue.add('sendEmail', { name, email, message }, { delay: 1000 });

        console.log(`📨 Added job ${job.id} to queue`);

        res.status(200).json({ success: true, jobId: job.id });
    } catch (error) {
        console.error('❌ Error occurred:', error);
        res.status(500).json({ success: false, message: 'Signup failed' });
    }
});






//  ---- > >  This is My code 
router.post('/signupuser', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

           // Queue a welcome email
        const message = `Welcome ${name}! Your signup was successful.`;
              const job =await NotificationQueue.add('sendEmail', { name, email, message }, { delay: 1000 });
;
        console.log(`Added job ${job.id} to the queue`);

        const shortId = shortid.generate();

        const jobDetails = new Register({
            name,
            email,
            password,
            shortId,
        });

        const checkSave = await jobDetails.save();
        console.log('Saved job details to MongoDB:', checkSave);

        res.status(200).json({ success: true, jobId: job.id });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ success: false, message: 'Failed to add job to the queue' });
    }
});







// User signup route  simple notfication ------------------
router.post('/user-signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // TODO: Add user to DB, hash password, etc.

        // Queue a welcome email
        const message = `Welcome ${name}! Your signup was successful.`;
        await NotificationQueue.add('sendEmail', { name, email, message }, { delay: 1000 });

        return res.status(200).json({
            success: true,
            name,
            email,
            message: 'User signed up and notification queued'
        });

    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ error: 'Server error during signup' });
    }
});

module.exports = router;




// POST /notify — adds a job to the notification queue

router.post('/notify', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const message = "User send email is successful";

    try {
        await NotificationQueue.add('sendEmail', {
            email,
            message,  // key: message, not messages
        }, { delay: 2000 });

        res.status(200).json({ success: true, message: 'Notification job added to the queue' });
    } catch (error) {
        console.error('Error adding job to queue:', error);
        res.status(500).json({ error: 'Failed to add job to the queue' });
    }
});

module.exports = router;