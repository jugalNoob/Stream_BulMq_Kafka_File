const express = require('express');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const nodemailer = require('nodemailer');
const Register = require("../module/student"); // Adjust path to your model
const signUp_User=require("../controoll/Form")
const forget_user=require("../controoll/forget")

const router = express.Router();



router.post("/signup" , signUp_User.first  )
router.post("/forget" , forget_user.update  )


// router.post("/nodemail", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ success: false, message: 'Missing required fields' });
//     }

//     const existingUser = await Register.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: 'Email already in use' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const shortId = shortid.generate();

//     const newUser = new Register({
//       name,
//       email,
//       password: hashedPassword,
//       shortId,
//     });

//     const savedUser = await newUser.save();
//     console.log(savedUser);

//     // ⬇️ Add email job to BullMQ queue
//     await emailQueue.add('send-welcome-email', {
//       name,
//       email,
//       shortId,
//     });

//     return res.status(201).json({
//       success: true,
//       message: 'User registered and email queued successfully',
//       userId: savedUser.shortId,
//     });

//   } catch (error) {
//     console.error('Error in /nodemail:', error);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });




// // 🧪 Optional: View Sent Mail Status in API
// // You can add an endpoint like:


// // const { Job } = require('bullmq');
// const emailQueue = require('../queues/emailQueue');




// router.get("/mail-status/:jobId", async (req, res) => {
//   try {
//     const job = await emailQueue.getJob(req.params.jobId);

//     console.log(job.data)
    
//     if (!job) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     const state = await job.getState();
//     const result = job.returnvalue; // Note: returnvalue is a property, not a method
    
// console.log(state)

// console.log(result)

//     res.json({
//       status: state,
//       result:result,
//       emailInfo: result || 'Pending or failed',
//     });
//   } catch (error) {
//     console.error('Error checking mail status:', error);
//     res.status(500).json({ message: "Error checking job status" });
//   }
// });


// /// simple Send email Your User


// router.post("/sendmail", async (req, res) => {
//   try {
//     const { name, email } = req.body;

//     if (!name || !email) {
//       return res.status(400).json({ success: false, message: 'Missing email info' });
//     }

//     const transporter = nodemailer.createTransport({

//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true, // true for 465, false for other ports
//       auth: {
//         user: "sjugal126@gmail.com", // use .env
//         pass: "chxe ihkr uqwq okqs",
//       },
//     });

//     const mailOptions = {
//       from:"sjugal126@gmail.com" , // owner 
//        to: email, // Send to recipient
//       subject: 'Welcome to Our Service!',
//       text: `Hi ${name},\n\nThank you for registering. Your user ID is.`,
//     };

//     const emailResponse = await transporter.sendMail(mailOptions);

//     return res.status(200).json({
//       success: true,
//       message: 'Email sent successfully',
//       info: emailResponse,
//     });

//   } catch (error) {
//     console.error('Error sending email:', error);
//     return res.status(500).json({ success: false, message: 'Failed to send email' });
//   }
// });


module.exports = router;



// /jugal786123