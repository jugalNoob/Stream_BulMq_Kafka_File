// kafka/deleteConsumer.js
const kafka = require("../client/client");
const connectDB = require("../db/conn");

async function initDeleteConsumer() {
    const consumer = kafka.consumer({ groupId: "delete-group-1" });

    try {
        await consumer.connect();
        console.log("✅ Kafka Delete Consumer connected");

        await consumer.subscribe({ topic: "UserDeleteTopic", fromBeginning: true });
        console.log("📡 Subscribed to 'UserDeleteTopic'");

        await consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    const userData = JSON.parse(message.value.toString());
                    console.log("🗑️ Received deleted user data:", userData);

                    // Optional: Log or archive data here
                } catch (err) {
                    console.error("❌ Failed to process delete message:", err);
                }
            },
        });
    } catch (error) {
        console.error("❌ Kafka Delete Consumer Error:", error);
    }
}

(async () => {
    await connectDB();
    await initDeleteConsumer();
})();
