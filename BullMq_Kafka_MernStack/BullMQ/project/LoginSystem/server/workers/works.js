const { Worker, Queue } = require('bullmq');

// Worker to process jobs
const worker = new Worker('emailQueue', async (job) => {

    console.log(`Processing job ${job.id}`);
    console.log(`Sending form  ${job.data}`);
    console.log("Message:", JSON.stringify(job));
    
    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('Form sent successfully!');
}, {
    connection: {
        host: 'localhost',
        port: 6379,
    },
});

// Event listeners
worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error: ${err.message}`);
});

