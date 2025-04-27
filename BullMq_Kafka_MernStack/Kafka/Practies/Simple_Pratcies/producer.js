// const kafka = require("./client"); // Import the Kafka client

// async function init() {
//   const producer = kafka.producer(); // Create a Kafka producer

//   console.log("Connecting producer...");
//   await producer.connect(); // Connect the producer
//   console.log("Producer connected successfully");

//   // Send a message to Kafka
//   await producer.send({
//     topic: 'rider-updates',
//     messages: [
//       {
//         partition: 0, // Optional: Specify a partition
//         key: "location-update", // Optional: Message key for ordering
//         value: JSON.stringify({ name: "jugal", loc: "Jammu" }), // Correct JSON.stringify usage
//       },
//     ],
//   });
//   console.log("Message sent successfully");

//   await producer.disconnect(); // Disconnect the producer
//   console.log("Producer disconnected successfully");
// }

// init().catch((error) => {
//   console.error("Error in producer:", error); // Catch and log errors
// });



// const kafka = require("./client"); // Import the Kafka client

// async function init() {
//   const producer = kafka.producer(); // Create a Kafka producer

//   try {
//     console.log("Connecting producer...");
//     await producer.connect(); // Connect the producer
//     console.log("Producer connected successfully");

//     // Check and add user data
//     const name = "Jugal Sharma";
//     const email = "jugal@example.com";
//     const password = "securepassword123";

//     // Validate required fields
//     if (!name || !email || !password) {
//       throw new Error("All fields (name, email, password) are required.");
//     }

//     // Create user object
//     const user = { name, email, password };

//     // Send user data to Kafka topic
//     await producer.send({
//       topic: 'rider-updates',
//       messages: [
//         {
//           key: email, // Using email as the key for ordering
//           value: JSON.stringify(user), // Serialize user object
//         },
//       ],
//     });
//     console.log("Message sent successfully:", user);

//   } catch (error) {
//     console.error("Error in producer:", error);
//   } finally {
//     await producer.disconnect(); // Ensure producer disconnects
//     console.log("Producer disconnected successfully");
//   }
// }

// // Initialize the producer
// init().catch((error) => {
//   console.error("Error during producer initialization:", error); // Log errors
// });
