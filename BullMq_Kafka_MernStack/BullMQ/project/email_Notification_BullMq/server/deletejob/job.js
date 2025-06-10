// const { Queue } = require('bullmq');
// const IORedis = require('ioredis');

// const connection = new IORedis(); // Optional config: host, port, etc.
// const queue = new Queue('emailQueue');

// // Function to clean old jobs
// const cleanOldJobs = async () => {
//     try {
//         const deletedJobIds = await queue.clean(
//             1000, // 1 second (for testing)
//             23,   // Max number of jobs to clean
//             'completed' // Clean completed jobs
//         );
//         console.log(`Cleaned up ${deletedJobIds.length} jobs:`, deletedJobIds);
//     } catch (error) {
//         console.error('Error cleaning old jobs:', error.message);
//     }
// };

// // Log job states periodically
// const logJobStates = async () => {
//     const completed = await queue.getJobs(['completed']);
//     const failed = await queue.getJobs(['failed']);
//     const paused = await queue.getJobs(['paused']);
//     console.log(`Completed: ${completed.length}, Failed: ${failed.length}, Paused: ${paused.length}`);
// };

// // Periodically clean old jobs and log states
// setInterval(cleanOldJobs, 5000); // Clean every 5 seconds
// setInterval(logJobStates, 5000); // Log states every 5 seconds



// delete  all job under 10 seconds and this is important 


// ❌ Why You Should Avoid obliterate() Periodically
// obliterate({ force: true }) deletes the entire queue data from Redis.

// Not even failed or pending jobs are spared.

// It should only be used during:

// Manual admin intervention

// Development/test cleanup

// One-time migration/reset

// const obliterateQueue = async () => {
//     try {
//         // Obliterate the queue with the force option
//         await queue.obliterate({ force: true });
//         console.log('Queue has been obliterated.');
//     } catch (error) {
//         console.error('Error obliterating the queue:', error.message);
//     }
// };

// // Call the function to obliterate the queue


// setInterval(obliterateQueue, 10000)






const { Queue } = require('bullmq');
const IORedis = require('ioredis');

// Redis connection (customize for production if needed)
const connection = new IORedis({
  host: 'localhost', // or your Redis host
  port: 6379,
  maxRetriesPerRequest: null,
});

const queue = new Queue('emailQueue', { connection });

// Utility function to log current timestamp
const now = () => new Date().toISOString();

/**
 * Cleans completed and failed jobs older than 10 seconds
 */
const cleanOldJobs = async () => {
  try {
    const completed = await queue.clean(10000, 100, 'completed');
    const failed = await queue.clean(10000, 100, 'failed');

    if (completed.length || failed.length) {
      console.log(`[${now()}] 🧹 Cleaned - Completed: ${completed.length}, Failed: ${failed.length}`);
    }
  } catch (err) {
    console.error(`[${now()}] ❌ Clean Error:`, err.message);
  }
};

/**
 * Logs counts of job states
 */
const logJobStates = async () => {
  try {
    const [completed, failed, active, waiting, delayed] = await Promise.all([
      queue.getJobCountByTypes('completed'),
      queue.getJobCountByTypes('failed'),
      queue.getJobCountByTypes('active'),
      queue.getJobCountByTypes('waiting'),
      queue.getJobCountByTypes('delayed'),
    ]);

    console.log(`[${now()}] 📊 Queue Status → Completed: ${completed}, Failed: ${failed}, Active: ${active}, Waiting: ${waiting}, Delayed: ${delayed}`);
  } catch (err) {
    console.error(`[${now()}] ❌ State Logging Error:`, err.message);
  }
};

// Run every 5 seconds
setInterval(cleanOldJobs, 5000);
setInterval(logJobStates, 5000);
