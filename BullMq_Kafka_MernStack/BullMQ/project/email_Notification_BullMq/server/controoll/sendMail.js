
router.post("/sendmail", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Missing email info' });
    }

    const transporter = nodemailer.createTransport({

      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "sjugal126@gmail.com", // use .env
        pass: "chxe ihkr uqwq okqs",
      },
    });

    const mailOptions = {
      from:"sjugal126@gmail.com" , // owner 
       to: email, // Send to recipient
      subject: 'Welcome to Our Service!',
      text: `Hi ${name},\n\nThank you for registering. Your user ID is.`,
    };

    const emailResponse = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      info: emailResponse,
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});