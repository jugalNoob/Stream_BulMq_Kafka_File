const express = require("express");
const shortid = require("shortid");
const { sendMessage, initProducer } = require("../producer/producer");
const Register = require("../module/student");

// const { sendMessages , initProducers } = require("../producer/product_get");
const { sendMessageToKafka } = require("../producer/product_get"); // Import producer funct

const { sendMessageupdate } = require("../producer/producer_up");

const router = express.Router();

// Initialize Kafka Producer
initProducer();

//  initProducers();

// Create User Route
router.post("/create-user", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "❌ Name, email, and password are required." });
    }

    try {
        const user = { name, email, password, shortId: shortid.generate() };
        await sendMessage("UserRestapi", user);

        res.status(201).json({
            message: "✅ User created and sent to Kafka successfully",
            user,
        });
    } catch (error) {
        console.error("❌ Error sending user data to Kafka:", error);
        res.status(500).json({ error: "Failed to send user data to Kafka" });
    }
});




// 📌 GET: Fetch All Users from MongoDB
// ✅ GET /users - Fetch users from MongoDB and send to Kafka
router.get("/users", async (req, res) => {
  try {
    const users = await Register.find({}); // Fetch all users from MongoDB

    // ✅ Send user data to Kafka
    await sendMessageToKafka("user-fetch-events", "all_users", users);
    console.log("Users sent to Kafka successfully");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


// Update Data In Kaskfa  ------------------->>


router.put("/update-user/:id", async (req, res) => {
  const { name, age, country } = req.body;
  const _id = req.params.id;

  if (!name || !age || !country) {
      return res.status(400).json({ error: "❌ Name, age, and country are required." });
  }

  try {
      const updatedUser = await Register.findByIdAndUpdate(
          _id,
          { name, age, country },
          { new: true }
      );

      if (!updatedUser) {
          return res.status(404).json({ status: "❌ User not found" });
      }

      // Send to Kafka
      await sendMessageupdate("UserUpdateTopic", updatedUser);

      res.status(200).json({
          message: "✅ User updated and message sent to Kafka",
          data: updatedUser,
      });
  } catch (error) {
      console.error("❌ Update error:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});



const { sendMessagedelete } = require("../kafka/producer");

router.delete("/delete-user/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        const deletedUser = await Register.findByIdAndDelete(_id);

        if (!deletedUser) {
            return res.status(404).json({ error: "❌ User not found" });
        }

        // 📨 Send deleted data to Kafka
        await sendMessagedelete("UserDeleteTopic", deletedUser);

        console.log("🗑️ User deleted and sent to Kafka:", deletedUser);
        res.status(200).json({
            message: "✅ User deleted successfully",
            data: deletedUser,
        });
    } catch (error) {
        console.error("❌ Delete error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const  Register = require('../module/student');
// const kafka = require('../client/client'); // Import the Kafka client
// const shortid = require('shortid'); // Import shortid library
// // Kafka Producer setup
// let producer;

// async function initProducer() {
//   try {
//     console.log('Connecting Kafka Producer...');
//     producer = kafka.producer();
//     await producer.connect();
//     console.log('Kafka Producer connected successfully');
//   } catch (error) {
//     console.error('Error initializing Kafka Producer:', error);
//   }
// }

// // Disconnect the producer gracefully when the server shuts down
// async function disconnectProducer() {
//   try {
//     if (producer) {
//       await producer.disconnect();
//       console.log('Kafka Producer disconnected successfully');
//     }
//   } catch (error) {
//     console.error('Error disconnecting Kafka Producer:', error);
//   }
// }

// // REST API to create a user and send data to Kafka
// router.post("/create-user", async (req, res) => {
//   const { name, email, password } = req.body;

  
//   const shortId = shortid.generate();
//   console.log(shortId)

//   // Validate required fields
//   if (!name || !email || !password) {
//     return res.status(400).json({ error: "Name, email, and password are required." });
//   }

//   try {
//     // Create user object
//     const user = { name, email, password , shortId };

//     // Send user data to Kafka topic
//     await producer.send({
//       topic: "UserRestapi", // Kafka topic name
//       messages: [
//         {
//           key: email, // Using email as the key for ordering
//           value: JSON.stringify(user), // Serialize user object
//         },
//       ],
//     });

//     console.log("Message sent successfully:", user);
//     res.status(201).json({
//       message: "User created and sent to Kafka successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Error sending user data to Kafka:", error);
//     res.status(500).json({ error: "Failed to send user data to Kafka" });
//   }
// });
// // Initialize Kafka producer when the server starts
// initProducer();

// // Gracefully disconnect the producer when the server shuts down
// process.on('SIGINT', async () => {
//   console.log('Shutting down server...');
//   await disconnectProducer();
//   process.exit(0);
// });

// module.exports = router;
