const kafka = require("../client/client");

async function southConsumer() {
  const consumer = kafka.consumer({ groupId: "south-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "rider-updates", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (partition === 1) {
        // console.log(`[SOUTH] ${message.value.toString()}`);
        console.log(`Topic: ${topic}, Partition: ${partition}, Offset: ${message.offset}, Key: ${message.key?.toString()}, Value: ${message.value.toString()}`);
      }
    },
  });
}

southConsumer();
