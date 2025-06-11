const { Worker } = require('bullmq');
const nodemailer = require('nodemailer');
const IORedis = require('ioredis');
require('dotenv').config(); // Load env variables

// Redis connection
const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
});

// Create BullMQ worker for forgetQueue
const worker = new Worker(
  'forgetQueue',
  async job => {
    const { email, resetCode } = job.data;

    // Configure mail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Use .env for Gmail auth
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password',
      text: `Hi,\n\nHere is your password reset code: ${resetCode}`,
    };

    await transporter.sendMail(mailOptions);

    // Optional delay for simulation
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(`📧 Reset password email sent to ${email}`);
  },
  {
    connection,
    concurrency: 5, // Process 5 forget emails in parallel
  }
);

// Event listeners
worker.on('completed', job => {
  console.log(`✅ Forget job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Forget job ${job?.id} failed: ${err.message}`);
});
