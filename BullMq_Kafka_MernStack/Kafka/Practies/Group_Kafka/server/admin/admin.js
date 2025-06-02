const kafka = require('../client/client'); // Import the Kafka instance from client.js

async function init() {
  const admin = kafka.admin(); // Correctly call admin() on the Kafka instance
  console.log("Admin connecting...");
  
  await admin.connect(); // Use await to ensure the connection completes
  console.log("Admin connected successfully");

  console.log("Creating Topic [rider-updates]");

  await admin.createTopics({
    topics: [{ 
      topic: 'rider-updates', 
      numPartitions: 2, 
      replicationFactor: 1 
    }],
  });
  
  console.log("Topic Created Successfully [rider-updates]");
  console.log("Disconnecting Admin...");
  
  await admin.disconnect();
  console.log("Admin disconnected");
}

init().catch(console.error); // Catch and log any errors