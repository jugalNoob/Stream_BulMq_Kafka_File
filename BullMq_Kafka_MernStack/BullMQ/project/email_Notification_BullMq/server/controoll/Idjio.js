const emailQueue = require('../queues/emailQueue');


router.get("/mail-status/:jobId", async (req, res) => {
  try {
    const job = await emailQueue.getJob(req.params.jobId);

    console.log(job.data)
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const state = await job.getState();
    const result = job.returnvalue; // Note: returnvalue is a property, not a method
    
console.log(state)

console.log(result)

    res.json({
        jobData:job.data,
      status: state,
      result:result,
      emailInfo: result || 'Pending or failed',
    });
  } catch (error) {
    console.error('Error checking mail status:', error);
    res.status(500).json({ message: "Error checking job status" });
  }
});
