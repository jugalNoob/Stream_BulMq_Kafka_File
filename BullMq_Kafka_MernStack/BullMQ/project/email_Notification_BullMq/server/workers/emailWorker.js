// const { Worker } = require('bullmq');

// // Worker to process jobs
// const worker = new Worker('emailQueue', async (job) => {
//     console.log(`Processing job ${job.id}`);
//     console.log(`Sending email to ${job.data.email}`);
//     console.log("Message:", JSON.stringify(job));
    
//     // Simulate sending email
//     await new Promise((resolve) => setTimeout(resolve, 3000));
//     console.log('Email sent successfully!');
// }, {
//     connection: {
//         host: 'localhost',
//         port: 6379,
//     },
// });

// // Event listeners
// worker.on('completed', (job) => {
//     console.log(`Job ${job.id} completed successfully`);
// });

// worker.on('failed', (job, err) => {
//     console.error(`Job ${job.id} failed with error: ${err.message}`);
// });


const { Worker } = require('bullmq');
const nodemailer = require('nodemailer');
const IORedis = require('ioredis');
require('dotenv').config(); // ⬅️ Load env variables

// Redis connection
const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
});

// Create BullMQ worker
const worker = new Worker(
  'emailQueue',
  async job => {
    const { name, email, shortId } = job.data;

    // Configure mail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
            user: "sjugal126@gmail.com", // use .env
        pass: "chxe ihkr uqwq okqs",
      },
    });

    const mailOptions = {
      from: "sjugal126@gmail.com",
      to: email,
      subject: 'Welcome to Our Service!',
      text: `Hi ${name},\n\nThank you for registering. Your user ID is ${shortId}.`,
    };

    await transporter.sendMail(mailOptions);

    // Simulate delay (optional)
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(`✅ Email sent to ${email}`);
  },
 
  {
  connection,             // Redis connection instance
  concurrency: 5,         // Number of jobs to process in parallel
  // lockDuration: 30000,    // Time (ms) the job lock is held (default: 30s)
  // autorun: true,          // Automatically run the worker (default: true)
  // removeOnComplete: true, // Automatically remove job on success
  // removeOnFail: {
  //   count: 5              // Keep last 5 failed jobs
  // },
  // useWorkerThreads: false,// Use worker threads (for CPU-heavy jobs)
  // runRetryDelay: 5000,    // Delay (ms) before retrying failed jobs
  // limiter: {
  //   max: 100,             // Max jobs in time window
  //   duration: 60000       // Time window (ms)
  // }
}
);

// Event listeners
worker.on('completed', job => {
  console.log(`🎉 Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});
