// --- >> BullMq Mongodb  ------------------->>>>


// workers/registerWorker.js

const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const Register = require('../module/student');
const connectDB = require('../db/conn');

// Redis connection with required BullMQ config
const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // 🔧 Required for BullMQ to work properly
});

// Main worker function
async function createWorker() {
  await connectDB();

  const worker = new Worker(
    'NotificationQueue',
    async (job) => {
      const data = job.data;
  const { name, email, password} = job.data;

      const existingUser = await Register.findOne({ email });
      if (existingUser) {
        console.warn(`⚠️ User with email ${email} already exists. Skipping insert.`);
        return;
      }

      const newUser = new Register({
        name, 
        email,
        password
      });

      await newUser.save();
      console.log(`✅ MongoDB: User saved from BullMQ job ${job.id}:`, newUser);

      // Optional delay to simulate email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`📧 Email sent successfully for job ${job.id}`);
    },
    { connection,
            concurrency: 5 // 🔥 Process 5 jobs in parallel
     }
  );

  // Events
  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed with error: ${err.message}`);
  });

  console.log("🚀 BullMQ worker for 'NotificationQueue' is running...");
}

createWorker().catch(console.error);

module.exports = { createWorker };





// const { Worker } = require('bullmq');

// const worker = new Worker('NotificationQueue', async (job) => {
//     const { name, email, message } = job.data;

//     console.log(`Processing job ${job.id}`);
//     console.log(`Sending email to: ${email}`);
//     console.log(`Sending name to: ${name}`);
//     console.log(`Message: ${message}`);

//     // Simulate sending email
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     console.log('✅ Email sent successfully!');
// }, {
//     connection: {
//         host: 'localhost',
//         port: 6379,
//     },
// });

// // Event listeners
// worker.on('completed', (job) => {
//     console.log(`✅ Job ${job.id} completed successfully`);
// });

// worker.on('failed', (job, err) => {
//     console.error(`❌ Job ${job.id} failed with error: ${err.message}`);
// });





// ------ >>> BullMq -->

// const { Worker } = require('bullmq');
// // const NotificationQueue = require('../queues/notificationQueue');

// const worker = new Worker('NotificationQueue', async (job) => {
//     const { name, email, message } = job.data;
    
//     console.log(`Processing job ${job.id}`);
//     console.log(`Sending email to: ${email}`);
//     console.log(`Sending name to: ${name}`);
//     console.log(`Message: ${message}`);

//     // In a real app, you would integrate with an email service here
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     console.log('✅ Email sent successfully!');
// }, {
//     connection: {
//         host: process.env.REDIS_HOST || 'localhost',
//         port: process.env.REDIS_PORT || 6379,
//     },
// });

// worker.on('completed', (job) => {
//     console.log(`✅ Job ${job.id} completed successfully`);
// });

// worker.on('failed', (job, err) => {
//     console.error(`❌ Job ${job.id} failed with error: ${err.message}`);
// });

// module.exports = worker;



// # Terminal 1
// node app.js

// # Terminal 2
// node workers/emailWorker.js


// await NotificationQueue.add('sendEmail', { name, email, message }, {
//   delay: 1000, // optional delay before first attempt
//   attempts: 5, // try 5 times max
//   backoff: {
//     type: 'exponential',
//     delay: 2000 // delay grows: 2s, 4s, 8s, etc.
//   },
//   removeOnComplete: true,
//   removeOnFail: false // keep failed jobs for debugging
// });
