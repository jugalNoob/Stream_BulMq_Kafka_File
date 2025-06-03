


 // ------------------------------- >>> Parttation consumer show  ------------------->>


// const kafka = require("../client/client");

// async function northConsumer() {
//   const consumer = kafka.consumer({ groupId: "north-group" });

//   await consumer.connect();
//   await consumer.subscribe({ topic: "north-updates", fromBeginning: true });

//   await consumer.run({
//   eachMessage: async ({ topic, partition, message }) => {
//     //if (partition !==0) return; // Only handle South messages
//     // console.log(`[SOUTH] Partition ${partition}: ${message.value.toString()}`);
//      console.log(`Topic: ${topic}, Partition: ${partition}, Offset: ${message.offset}, Key: ${message.key?.toString()}, Value: ${message.value.toString()}`);
//   },


  
// });


  // await consumer.run({
  //   eachMessage: async ({ topic, partition, message }) => {
  //     if (partition === 0) {
  //       // console.log(`partition${partition} [NORTH] ${message.value.toString()}`);\
  //     console.log(`Topic: ${topic}, Partition: ${partition}, Offset: ${message.offset}, Key: ${message.key?.toString()}, Value: ${message.value.toString()}`);
  //     }
  //   },
  // });
// }

// northConsumer();




/// ---------------- >Kafka user data add with BullMQ  -------------------->>>>>





// const kafka = require("../client/client");
// const NotificationQueue = require("../queues/noticationQueu"); // Correct queue import

// async function northConsumer() {
//   const consumer = kafka.consumer({ groupId: "north-group" });

//   await consumer.connect();
//   await consumer.subscribe({ topic: "north-updates", fromBeginning: true });

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       const key = message.key?.toString();
//       const value = message.value.toString();

//       console.log(`📥 Kafka Message:
//         🔹 Topic: ${topic}
//         🔹 Partition: ${partition}
//         🔹 Offset: ${message.offset}
//         🔹 Key: ${key}
//         🔹 Value: ${value}
//       `);

//       try {
//         // Parse the value assuming it's a JSON string
//         const data = JSON.parse(value);
        
        



//         // Push to BullMQ for processing (e.g., sendEmail)
//         await NotificationQueue.add('sendEmail', data, {
//           // jobId: key,
//           delay: 1000,
//           attempts: 3,
//           backoff: {
//             type: 'exponential',
//             delay: 1000
//           },
//           removeOnComplete: true,
//           removeOnFail: false
//         });

//         console.log('📤 Job added to BullMQ queue successfully.' ,      );//, jobId: job.id,
//       } catch (error) {
//         console.error('❌ Failed to process Kafka message:', error);
//       }
//     }
//   });
// }

//  northConsumer();



// ------------ >>> Kafka user consumer Bull Mq  and MonoDb Data base 



const kafka = require("../client/client");
const connectDB = require("../db/conn");
// const RegisterQueue = require("../queues/registerQueue"); // BullMQ queue

 const NotificationQueue = require("../queues/noticationQueu"); // Correct queue import


async function initConsumer() {
    const consumer = kafka.consumer({ groupId: "user-group-Create" });

    try {
        console.log("🔄 Connecting Kafka Consumer...");
        await consumer.connect();
        console.log("✅ Consumer connected successfully");

        await consumer.subscribe({ topic: "UserRestapi", fromBeginning: true });
        console.log("✅ Subscribed to topic 'UserRestapi'");

        await consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    const userData = JSON.parse(message.value.toString());
                    console.log(`📥 Received message: ${JSON.stringify(userData)}`);

                    // Validate fields (minimal check here)
                    const { name, price, age, birthDate, bloodGroup, email, hobbies, country, bio, gender } = userData;
                    if (
                        !name || !price || !age || !birthDate || !bloodGroup || !email ||
                        !hobbies || !country || !bio || !gender
                    ) {
                        console.warn("⚠️ Missing required fields. Skipping.");
                        return;
                    }

                    // Add job to BullMQ for processing
                    const job = await NotificationQueue.add('saveUser', userData, {
                        delay: 1000,
                        attempts: 3,
                        backoff: {
                            type: 'exponential',
                            delay: 1000
                        },
                        removeOnComplete: true,
                        removeOnFail: false
                    });

                    console.log(`📤 Job queued (ID: ${job.id}) for MongoDB insert`);
                } catch (error) {
                    console.error("❌ Error processing Kafka message:", error);
                }
            },
        });
    } catch (error) {
        console.error("❌ Kafka Consumer Error:", error);
    }
}

(async () => {
    await connectDB();
    await initConsumer();
})();
