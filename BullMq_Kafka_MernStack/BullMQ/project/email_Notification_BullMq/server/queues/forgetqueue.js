const { Queue } = require('bullmq');


const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
});

// Initialize the queue

const forgetQueue = new Queue('forgetQueue', { connection }); // ✅ fix the queue name here
module.exports = forgetQueue;
