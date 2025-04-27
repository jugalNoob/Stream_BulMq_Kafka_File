const { Worker } = require('bullmq');

const worker = new Worker('my-queue', async (job) => {
    console.log(`Processing job: ${job.id}`);
    console.log("Processing message...");
    console.log("Message:", JSON.stringify(job));
    console.log("Sending email to", job.data.email);

    // Simulate processing time with a 5-second delay
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 5 * 1000);
    });
}, {
    connection: {
        host: 'localhost',
        port: 6379
    }
});

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully!`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error: ${err.message}`);
});
