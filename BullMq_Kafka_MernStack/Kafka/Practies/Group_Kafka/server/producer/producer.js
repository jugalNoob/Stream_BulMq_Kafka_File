const kafka = require("../client/client");

async function northProducer() {
  const producer = kafka.producer();

  await producer.connect();
  console.log("North Producer connected");

  const messages = [
    { key: "north-1", value: JSON.stringify({ name: "Amit", loc: "Delhi" }), partition: 0 },
    { key: "north-2", value: JSON.stringify({ name: "Jugal", loc: "Jammu" }), partition: 0 },
  ];

  await producer.send({
    topic: "rider-updates",
    messages,
  });

  console.log("North messages sent");
  await producer.disconnect();
}

northProducer();
