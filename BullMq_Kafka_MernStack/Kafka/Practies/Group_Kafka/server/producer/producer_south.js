const kafka = require("../client/client");

async function southProducer() {
  const producer = kafka.producer();

  await producer.connect();
  console.log("South Producer connected");

  const messages = [
    { key: "south-1", value: JSON.stringify({ name: "Ravi", loc: "Chennai" }), partition: 1 },
    { key: "south-2", value: JSON.stringify({ name: "Anu", loc: "Hyderabad" }), partition: 1 },
  ];

  await producer.send({
    topic: "rider-updates",
    messages,
  });

  console.log("South messages sent");
  await producer.disconnect();
}

southProducer();



// Let me know if you want to:

// Manually assign partitions instead of subscribing to all

// Track message offsets and rebalance logic