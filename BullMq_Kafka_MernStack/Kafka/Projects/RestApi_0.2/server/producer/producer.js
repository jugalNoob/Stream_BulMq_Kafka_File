const kafka = require("../client/client");

let producer;

async function initProducer() {
    try {
        producer = kafka.producer();
        await producer.connect();
        console.log("✅ Kafka Producer with post connected successfully");
    } catch (error) {
        console.error("❌ Error initializing Kafka Producer:", error);
    }
}

async function sendMessage(topic, message) {
    try {
        if (!producer) {
            throw new Error("Kafka producer is not initialized.");
        }
        await producer.send({
            topic,
            messages: [{ key: message.email, value: JSON.stringify(message) }],
        });
        console.log(`📩 Message sent to Kafka topic "${topic}":`, message);
    } catch (error) {
        console.error("❌ Error sending message to Kafka:", error);
    }
}

async function disconnectProducer() {
    try {
        if (producer) {
            await producer.disconnect();
            console.log("✅ Kafka Producer disconnected successfully");
        }
    } catch (error) {
        console.error("❌ Error disconnecting Kafka Producer:", error);
    }
}

process.on("SIGINT", async () => {
    await disconnectProducer();
    process.exit(0);
});

module.exports = { initProducer, sendMessage };
