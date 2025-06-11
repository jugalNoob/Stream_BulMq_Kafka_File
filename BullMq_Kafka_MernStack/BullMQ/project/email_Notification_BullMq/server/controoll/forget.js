const bcrypt = require('bcrypt');
const shortid = require('shortid');
const nodemailer = require('nodemailer');
const Register = require("../module/student"); // Adjust path to your model 

const forgetQueue=require("../queues/forgetqueue")

exports.update = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.status(400).json({ error: "New password cannot be the same as the old password" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const updatedUser = await Register.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    // ✅ Generate reset code
    const resetCode = shortid.generate(); // or any other logic

    // ✅ Add email job to forgetQueue
    await forgetQueue.add('send-forget-email', {
      email,
      resetCode,
    });

    console.log("User updated:", updatedUser);
    res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
