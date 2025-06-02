const AWS = require('aws-sdk');

const sqs = new AWS.SQS({
  region: 'us-east-1',
  accessKeyId: 'YOUR_ACCESS_KEY',
  secretAccessKey: 'YOUR_SECRET_KEY'
});

const QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/YOUR_ID/your-queue-name';

exports.sendToQueue = async (data) => {
  const params = {
    MessageBody: JSON.stringify(data),
    QueueUrl: QUEUE_URL
  };

  await sqs.sendMessage(params).promise();
  console.log('Message sent to SQS:', data);
};
