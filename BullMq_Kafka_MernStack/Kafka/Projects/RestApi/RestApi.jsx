Steps to Integrate Kafka with REST API:
Kafka as Producer in a REST API:

When a request is received at a REST API endpoint, the API can produce messages to Kafka.
Example (Node.js + Express + Kafka):

const express = require("express");
const { Kafka } = require("kafkajs");

const app = express();
const kafka = new Kafka({
  clientId: "rest-api-client",
  brokers: ["localhost:9092"],  // Kafka brokers
});

const producer = kafka.producer();

app.use(express.json());

// Example of sending a message to Kafka when an API endpoint is hit
app.post("/order", async (req, res) => {
  const { orderId, userId } = req.body;

  try {
    // Connect the producer to Kafka
    await producer.connect();

    // Send the message to Kafka
    await producer.send({
      topic: "order-placed",  // Kafka topic
      messages: [
        { value: JSON.stringify({ orderId, userId }) },
      ],
    });

    // Send response back to the API user
    res.status(200).json({ message: "Order placed successfully" });

    // Disconnect the producer
    await producer.disconnect();
  } catch (error) {
    console.error("Error producing message to Kafka:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("REST API server running on port 3000");
});


:::Kafka as Consumer in a REST API:

You can have a consumer within your REST API that listens to a Kafka topic and reacts to messages asynchronously.
Example (Node.js + Express + Kafka):

const express = require("express");
const { Kafka } = require("kafkajs");

const app = express();
const kafka = new Kafka({
  clientId: "rest-api-client",
  brokers: ["localhost:9092"],  // Kafka brokers
});

const consumer = kafka.consumer({ groupId: "order-consumer-group" });

app.use(express.json());

// Start the Kafka consumer in the background
async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "order-placed", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value.toString()}`);
      // Process the message (e.g., update the database)
    },
  });
}

// Start consuming Kafka messages
startConsumer().catch((error) => {
  console.error("Error starting consumer:", error);
});

app.listen(3000, () => {
  console.log("REST API server running on port 3000");
});

Common Patterns for Kafka in REST API:
Producer-Consumer Model: The API can act as a producer and consumer, publishing messages to Kafka and consuming events from Kafka.
Asynchronous Processing: Kafka helps decouple processes and handle long-running tasks asynchronously. For example, your REST API might receive a request that triggers a background process (handled by consuming Kafka messages).
Event-Driven: REST API endpoints can trigger events in Kafka (e.g., user-registered, order-placed) that other services listen to and act upon.
Benefits of Using Kafka in REST APIs:
Decoupling: Kafka enables decoupling between services, allowing them to communicate asynchronously. This improves the scalability and flexibility of your system.
Event-Driven Architecture: Kafka facilitates an event-driven approach, where services can react to events as they happen.
Resilience: Kafka helps in managing high-throughput data in distributed systems, making your API more resilient to failures.
Scalability: Kafka can handle large volumes of data, making it suitable for APIs with high traffic or complex workflows.
Considerations:
Latency: Kafka is usually used for asynchronous communication, so there might be some delay in processing messages, depending on how the consumers are configured.
Error Handling: Ensure to handle any Kafka consumer or producer failures gracefully to avoid data loss or failures in your REST API.
State Management: Since Kafka is designed to be stateless, you'll need to ensure that your REST API maintains state (like order status) in a separate database or cache.


:::::::: with Mongodb ::::::::::::::::::::: :::::::::::::::::::::::::_____________________::::::::::::::::::


Here’s how you can integrate MongoDB and Kafka in your REST API using Node.js, Express, KafkaJS, and MongoDB.

Prerequisites:
MongoDB: Set up and running, or you can use a cloud MongoDB instance like MongoDB Atlas.
Kafka: Set up and running, or use a managed Kafka service.
Steps for Integration:
Install Required Packages: You need to install express, kafkajs, mongoose, and other


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/kafka-mongo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;




const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  status: { type: String, default: 'pending' },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;



Step 3: Set up Kafka Producer in REST API
Create a producer.js file for sending messages to Kafka when an order is placed:

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'rest-api-client',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

const produceMessage = async (topic, message) => {
  await producer.connect();
  await producer.send({
    topic: topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  await producer.disconnect();
};

module.exports = produceMessage;

Step 4: Set up Kafka Consumer to Process Messages
Create a consumer.js file to listen for Kafka messages and save them in MongoDB:
const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');
const connectDB = require('./db');
const Order = require('./models/Order');  // Import your MongoDB model
const kafka = new Kafka({
  clientId: 'kafka-consumer-client',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'order-group' });

const consumeMessages = async () => {
  await connectDB();  // Connect to MongoDB

  await consumer.connect();
  await consumer.subscribe({ topic: 'order-placed', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const orderData = JSON.parse(message.value.toString());
      console.log(`Received order data: ${JSON.stringify(orderData)}`);

      // Save to MongoDB
      const order = new Order(orderData);
      await order.save();
      console.log('Order saved to MongoDB:', order);
    },
  });
};

consumeMessages().catch(console.error);



Step 5: Set up the REST API with Express
Now, create a server.js file for the REST API:

const express = require('express');
const produceMessage = require('./producer');  // Import the producer
const connectDB = require('./db');  // Import MongoDB connection
const app = express();
app.use(express.json());

// Initialize MongoDB
connectDB();

// REST API to place an order
app.post('/order', async (req, res) => {
  const { orderId, userId } = req.body;

  const orderData = { orderId, userId };

  try {
    // Send order data to Kafka
    await produceMessage('order-placed', orderData);

    // Respond to the client
    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order' });
  }
});

// Start the API server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});




node consumer.js

node server.js
