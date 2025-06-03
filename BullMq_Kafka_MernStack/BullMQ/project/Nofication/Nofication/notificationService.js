const NotificationQueue = require('../queues/noticationQueu');

async function enqueueWelcomeEmail({ name, email }) {
  const message = `Welcome ${name}! Your signup was successful.`;

  const job = await NotificationQueue.add('sendEmail', { name, email, message }, {
    delay: 1000,
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true,
    removeOnFail: false
  });

  return job;
}

module.exports = {
  enqueueWelcomeEmail
};
