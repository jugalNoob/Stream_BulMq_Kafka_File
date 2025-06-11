const bcrypt = require('bcrypt');
const shortid = require('shortid');
const nodemailer = require('nodemailer');
const Register = require("../module/student"); // Adjust path to your model

exports.first = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const shortId = shortid.generate();

    const newUser = new Register({
      name,
      email,
      password: hashedPassword,
      shortId,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    // ⬇️ Add email job to BullMQ queue
    await emailQueue.add('send-welcome-email', {
      name,
      email,
      shortId,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered and email queued successfully',
      userId: savedUser.shortId,
    });

  } catch (error) {
    console.error('Error in /nodemail:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

