// const kafka = require("../client/client"); // Import the Kafka instance from client.js

// async function init() {
//   const admin = kafka.admin(); // Correctly call admin() on the Kafka instance
//   console.log("Admin connecting...");
  
//   await admin.connect(); // Use await to ensure the connection completes
//   console.log("Admin connected successfully");

//   console.log("Creating Topic [UserRestapi]");

//   await admin.createTopics({
//     topics: [{ 
//       topic: 'UserRestapi', 
//       numPartitions: 2, 
//       replicationFactor: 1 
//     }],
//   });
  
//   console.log("Topic Created Successfully [rider-updates]");
//   console.log("Disconnecting Admin...");
  
//   await admin.disconnect();
//   console.log("Admin disconnected");
// }

// init().catch(console.error); // Catch and log any errors




const kafka = require("../client/client");

async function createKafkaTopic(topicName, numPartitions = 2, replicationFactor = 1) {
  const admin = kafka.admin();
  console.log("🔌 Connecting Kafka Admin...");

  try {
    await admin.connect();
    console.log("✅ Admin connected");

    // Check if topic already exists
    const existingTopics = await admin.listTopics();
    if (existingTopics.includes(topicName)) {
      console.log(`⚠️ Topic "${topicName}" already exists.`);
    } else {
      console.log(`📦 Creating topic "${topicName}"...`);
      await admin.createTopics({
        topics: [{
          topic: topicName,
          numPartitions,
          replicationFactor,
        }],
      });
      console.log(`✅ Topic "${topicName}" created successfully.`);
    }
  } catch (err) {
    console.error("❌ Error creating topic:", err);
  } finally {
    console.log("🧹 Disconnecting Kafka Admin...");
    await admin.disconnect();
    console.log("✅ Admin disconnected");
  }
}

createKafkaTopic("UserRestapi").catch(console.error);
