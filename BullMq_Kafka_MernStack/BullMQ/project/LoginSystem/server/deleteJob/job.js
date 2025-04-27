const { Queue } = require('bullmq');

const queue = new Queue('emailQueue');

// Function to clean old jobs
const cleanOldJobs = async () => {
    try {
        const deletedJobIds = await queue.clean(
            1000, // 1 second (for testing)
            23,   // Max number of jobs to clean
            'completed' // Clean completed jobs
        );
        console.log(`Cleaned up ${deletedJobIds.length} jobs:`, deletedJobIds);
    } catch (error) {
        console.error('Error cleaning old jobs:', error.message);
    }
};

// Log job states periodically
const logJobStates = async () => {
    const completed = await queue.getJobs(['completed']);
    const failed = await queue.getJobs(['failed']);
    const paused = await queue.getJobs(['paused']);
    console.log(`Completed: ${completed.length}, Failed: ${failed.length}, Paused: ${paused.length}`);
};

// Periodically clean old jobs and log states
setInterval(cleanOldJobs, 5000); // Clean every 5 seconds
setInterval(logJobStates, 5000); // Log states every 5 seconds



// delete  all job under 10 seconds and this is important 

const obliterateQueue = async () => {
    try {
        // Obliterate the queue with the force option
        await queue.obliterate({ force: true });
        console.log('Queue has been obliterated.');
    } catch (error) {
        console.error('Error obliterating the queue:', error.message);
    }
};

// Call the function to obliterate the queue


setInterval(obliterateQueue, 10000)




// const recreateQueue = async () => {
//     try {
//         await queue.obliterate({ force: true });
//         console.log('Queue obliterated.');

//         // Recreate the queue
//         const newQueue = new Queue('paint', {
//             connection: { host: 'localhost', port: 6379 },
//         });
//         console.log('Queue recreated.');
//     } catch (error) {
//         console.error('Error resetting the queue:', error.message);
//     }
// };

// recreateQueue();





/// in 10000 seconds remove old jobs    ;;;;;;;;;;;;;;;;;; :::::::::::::::::::::

// const clearQueue = async () => {
//     try {

        
//         // Drain the queue
//         await queue.drain();
//         console.log('Queue has been cleared (all jobs removed).');
//     } catch (error) {
//         console.error('Error draining the queue:', error.message);
//     }
// };

// // Call the function to drain the queue
// setInterval(clearQueue, 10000)


// setInterval(logJobStates, 5000); // Log states every 5 seconds


