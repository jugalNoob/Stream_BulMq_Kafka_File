const kafka = require("../client/client");

async function northConsumer() {
  const consumer = kafka.consumer({ groupId: "north-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "rider-updates", fromBeginning: true });

  await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    if (partition !==0) return; // Only handle South messages
    // console.log(`[SOUTH] Partition ${partition}: ${message.value.toString()}`);
     console.log(`Topic: ${topic}, Partition: ${partition}, Offset: ${message.offset}, Key: ${message.key?.toString()}, Value: ${message.value.toString()}`);
  },
});


  // await consumer.run({
  //   eachMessage: async ({ topic, partition, message }) => {
  //     if (partition === 0) {
  //       // console.log(`partition${partition} [NORTH] ${message.value.toString()}`);\
  //     console.log(`Topic: ${topic}, Partition: ${partition}, Offset: ${message.offset}, Key: ${message.key?.toString()}, Value: ${message.value.toString()}`);
  //     }
  //   },
  // });
}

northConsumer();
