// kafka/updateConsumer.js
const kafka = require("../client/client");
const connectDB = require("../db/conn");

async function initUpdateConsumer() {
    const consumer = kafka.consumer({ groupId: "update-group-1" });

    try {
        await consumer.connect();
        console.log("✅ Connected to Kafka as update consumer");

        await consumer.subscribe({ topic: "UserUpdateTopic", fromBeginning: true });
        console.log("📡 Subscribed to 'UserUpdateTopic'");

        await consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    const userData = JSON.parse(message.value.toString());
                    console.log("🔁 Received updated user:", userData);

                    // Optional: log to DB, send to analytics, etc.

                } catch (err) {
                    console.error("❌ Failed to process update message:", err);
                }
            },
        });
    } catch (error) {
        console.error("❌ Kafka Update Consumer Error:", error);
    }
}

(async () => {
    await connectDB();
    await initUpdateConsumer();
})();
