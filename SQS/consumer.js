const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');

const sqs = new AWS.SQS({
  region: 'us-east-1',
  accessKeyId: 'YOUR_ACCESS_KEY',
  secretAccessKey: 'YOUR_SECRET_KEY'
});

const QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/YOUR_ID/your-queue-name';

const app = Consumer.create({
  queueUrl: QUEUE_URL,
  handleMessage: async (message) => {
    const { name, email } = JSON.parse(message.Body);
    console.log(`📢 Notification: Hello ${name}! Welcome, your email is ${email}`);
  },
  sqs,
});

app.on('error', (err) => console.error('Error:', err.message));
app.on('processing_error', (err) => console.error('Processing error:', err.message));

app.start();
console.log('SQS consumer started...');



// const app = Consumer.create({
//   queueUrl: 'https://sqs.your-region.amazonaws.com/account-id/queue-name',
//   handleMessage: async (message) => { ... },
//   batchSize: 5,                  // max 10
//   visibilityTimeout: 30,         // seconds
//   waitTimeSeconds: 20,           // long polling
//   sqs: new AWS.SQS({ ... })      // custom config
// });
