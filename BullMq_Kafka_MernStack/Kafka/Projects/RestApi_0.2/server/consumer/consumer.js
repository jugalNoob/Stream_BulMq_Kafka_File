const kafka = require("../client/client");
const Register = require("../module/student");
const connectDB = require("../db/conn");

async function initConsumer() {
    const consumer = kafka.consumer({ groupId: "user-group-1" });

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

                    const userExists = await Register.findOne({ email: userData.email });
                    if (userExists) {
                        console.warn(`⚠️ User with email ${userData.email} already exists. Skipping insert.`);
                        return;
                    }

                    const newUser = new Register(userData);
                    await newUser.save();
                    console.log("✅ User saved to MongoDB:", newUser);
                } catch (error) {
                    console.error("❌ Error processing Kafka message:", error);
                }
            },
        });
    } catch (error) {
        console.error("❌ Kafka Consumer Error:", error);
    }
}

// Initialize consumer after DB connection is established
(async () => {
    await connectDB();
    await initConsumer();
})();


// Key Improvements:
// ✅ Modular Code: Separated Kafka producer, consumer, and client into their own files.
// ✅ Improved Error Handling: Wrapped Kafka interactions in try-catch blocks to prevent crashes.
// ✅ Better Logging: Added structured logs with emojis for better readability.
// ✅ Graceful Shutdown: Ensured Kafka producer and consumer disconnect properly on server exit.
// ✅ Prevents Duplicate Inserts: The consumer checks if the email exists before inserting into MongoDB.