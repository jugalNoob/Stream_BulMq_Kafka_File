const connectionsQueue = require("../bullconnection/connection");
const  Register=require("../model/student")
const shortid = require('shortid');

exports.first = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const job = await connectionsQueue.add('send-email', { name, email, password },{ delay: 5000 });
        console.log(`Added job ${job.id} to the queue`);
        
        console.log(job.data)

        const shortId = shortid.generate();

        console.log(req.body)

        /// --- >> dont use for mongodb db save data 

        // const jobDetails = new Register({
          
        //     name , email, password , shortId,
        // });

        // const checkSave = await jobDetails.save();
        // console.log('Saved job details to MongoDB:', checkSave);

        res.status(200).json({ success: true, jobId: job.id });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ success: false, message: 'Failed to add job to the queue' });
    }
};
