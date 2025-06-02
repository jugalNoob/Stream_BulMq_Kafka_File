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






const { Worker } = require('bullmq');
// const NotificationQueue = require('../queues/notificationQueue');

const worker = new Worker('NotificationQueue', async (job) => {
    const { name, email, message } = job.data;
    
    console.log(`Processing job ${job.id}`);
    console.log(`Sending email to: ${email}`);
    console.log(`Sending name to: ${name}`);
    console.log(`Message: ${message}`);

    // In a real app, you would integrate with an email service here
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ Email sent successfully!');
}, {
    connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    },
});

worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job.id} failed with error: ${err.message}`);
});

module.exports = worker;



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
