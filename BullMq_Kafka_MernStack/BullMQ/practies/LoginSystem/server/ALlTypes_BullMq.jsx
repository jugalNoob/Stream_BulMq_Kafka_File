// --- >>>> Bull mQ All Infomration And Topices --------------->>>
1::Queues
Auto-removal of jobs
await myQueue.add(
  'test',
  { foo: 'bar' },
  {
    removeOnComplete: {
      age: 3600, // keep up to 1 hour
      count: 1000, // keep up to 1000 jobs
    },
    removeOnFail: {
      age: 24 * 3600, // keep up to 24 hours
    },
  },
);

Adding jobs in bulk

const queue = new Queue('paint');

const name = 'jobName';
const jobs = await queue.addBulk([
  { name, data: { paint: 'car' } },
  { name, data: { paint: 'house' } },
  { name, data: { paint: 'boat' } },
]);

Global Concurrency

import { Queue } from 'bullmq';

await queue.setGlobalConcurrency(4);
And in order to get this value:

Copy
const globalConcurrency = await queue.getGlobalConcurrency();

Removing Jobs
Removes all jobs that are waiting or delayed, but not active, waiting-children, completed or failed.

Copy
import { Queue } from 'bullmq';

const queue = new Queue('paint');

await queue.drain();

2:::Workers ::: --> 

Auto-removal of jobs
Concurrency
Graceful shutdown
Stalled Jobs
Sandboxed processors
Pausing queues
const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const redis = new IORedis();

const myQueue = new Queue('emailQueue', { connection: redis });

(async () => {
  console.log('⏸️ Pausing queue...');
  await myQueue.pause();
  console.log('✅ Queue paused');

  // Wait 10 seconds and resume
  setTimeout(async () => {
    console.log('▶️ Resuming queue...');
    await myQueue.resume();
    console.log('✅ Queue resumed');
  }, 10000);
})();




3 ::  -->>> Jobs
FIFO
LIFO
Last-in, First Out

const myQueue = new Queue('Paint');
// Add a job that will be processed before all others
await myQueue.add('wall', { color: 'pink' }, { lifo: true });

Job Ids
await myQueue.add(
  'wall',
  { color: 'pink' },
  {
    jobId: customJobId,
  },
);
Job Data

import { Queue } from 'bullmq';

const myQueue = new Queue('paint');

const job = await myQueue.add('wall', { color: 'red' });

job.data; // { color: 'red' }

await job.updateData({
  color: 'blue',
});

job.data; // { color: 'blue' }

Deduplication

// Add a job that will be deduplicated as this record is not finished (completed or failed).
await myQueue.add(
  'house',
  { color: 'white' },
  { deduplication: { id: 'customValue' } },
);

import { Queue } from 'bullmq';

const myQueue = new Queue('Paint');

// Add a job that will be deduplicated for 5 seconds.
await myQueue.add(
  'house',
  { color: 'white' },
  { deduplication: { id: 'customValue', ttl: 5000 } },
);


import { Queue } from 'bullmq';

const myQueue = new Queue('Paint');

const worker = new Worker('Paint', async () => {});

worker.once('completed', job => {
  // only one instance is completed and
  // 9 additions were ignored
  console.log(job.data.color); // `white 10`
});

// Add 10 jobs with deduplication option in debounce mode.
for (let i = 1; i < 11; i++) {
  await myQueue.add(
    'house1',
    { color: `white ${i}` },
    {
      deduplication: {
        id: 'customValue',
        ttl: 5000,
        extend: true,
        replace: true,
      },
      delay: 5000,
    },
  );
}


import { QueueEvents } from 'bullmq';

const queueEvents = new QueueEvents('myQueue');

queueEvents.on(
  'deduplicated',
  ({ jobId, deduplicationId, deduplicatedJobId }, id) => {
    console.log(`Job ${deduplicatedJobId} was deduplicated due to existing job ${jobId} 
  with deduplication ID ${deduplicationId}`);
  },
);
Get Deduplication Job Id
If you need to know the id of the job that started the deduplicated state, you can call the getDeduplicationJobId method.

Copy
const jobId = await myQueue.getDeduplicationJobId('customValue');

await myQueue.removeDeduplicationKey('customValue');


Delayed
import { Queue } from 'bullmq';

const myQueue = new Queue('Paint');

// Add a job that will be delayed by at least 5 seconds.
await myQueue.add('house', { color: 'white' }, { delay: 5000 });

Repeatable

import { Queue, QueueScheduler } from 'bullmq';

const myQueueScheduler = new QueueScheduler('Paint');
const myQueue = new Queue('Paint');

// Repeat job once every day at 3:15 (am)
await myQueue.add(
  'submarine',
  { color: 'yellow' },
  {
    repeat: {
      pattern: '0 15 3 * * *',
    },
  },
);

// Repeat job every 10 seconds but no more than 100 times
await myQueue.add(
  'bird',
  { color: 'bird' },
  {
    repeat: {
      every: 10000,
      limit: 100,
    },
  },
);

import { Queue, QueueScheduler } from 'bullmq';

const myQueueScheduler = new QueueScheduler('Paint');
const myQueue = new Queue('Paint');

// Repeat job every 10 seconds but no more than 100 times
await myQueue.add(
  'bird',
  { color: 'bird' },
  {
    repeat: {
      every: 10000,
      limit: 100,
    },
    jobId: 'colibri',
  },
);

await myQueue.add(
  'bird',
  { color: 'bird' },
  {
    repeat: {
      every: 10000,
      limit: 100,
    },
    jobId: 'pigeon',
  },
);
Prioritized

import { Queue } from 'bullmq';

const myQueue = new Queue('Paint');

await myQueue.add('wall', { color: 'pink' }, { priority: 10 });
await myQueue.add('wall', { color: 'brown' }, { priority: 5 });
await myQueue.add('wall', { color: 'blue' }, { priority: 7 });

// The wall will be painted first brown, then blue and
// finally pink.


const job = await Job.create(queue, 'test2', { foo: 'bar' }, { priority: 16 });

await job.changePriority({
  priority: 1,
});
or if you want to use the LIFO (Last In, First Out) option:

Copy
const job = await Job.create(queue, 'test2', { foo: 'bar' }, { priority: 16 });

await job.changePriority({
  lifo: true,
});

const jobs = await queue.getJobs(['prioritized']);

const jobs2 = await queue.getPrioritized();


Removing jobs

import { Queue } from 'bullmq';

const queue = new Queue('paint');

const job = await queue.add('wall', { color: 1 });

await job.remove();
Stalled
Getters



4::: ---- >>>Job Schedulers
Repeat Strategies
Repeat options
Manage Job Schedulers 



5::: ----->>> Flows
Adding flows in bulk
Get Flow Tree
Fail Parent
Continue Parent
Remove Dependency
Ignore Dependency
Remove Child Dependency


6:: -->>Metrics
Prometheus


7:: --> Rate Limit Bull Mq :: -->>

import { Worker, QueueScheduler } from 'bullmq';

const worker = new Worker('painter', async job => paintCar(job), {
  limiter: {
    max: 10,
    duration: 1000,
  },
});

const scheduler = new QueueScheduler('painter');


import { Queue, Worker, QueueScheduler } from 'bullmq';

const queue = new Queue('painter', {
  limiter: {
    groupKey: 'customerId',
  },
});

const worker = new Worker('painter', async job => paintCar(job), {
  limiter: {
    max: 10,
    duration: 1000,
    groupKey: 'customerId',
  },
});

const scheduler = new QueueScheduler('painter');

// jobs will be rate limited by the value of customerId key:
await queue.add('rate limited paint', { customerId: 'my-customer-id' });



import { Worker } from 'bullmq';

const worker = new Worker(
  'myQueue',
  async () => {
    const [isRateLimited, duration] = await doExternalCall();
    if (isRateLimited) {
      await worker.rateLimit(duration);
      // Do not forget to throw this special exception,
      // since we must differentiate this case from a failure
      // in order to move the job to wait again.
      throw Worker.RateLimitError();
    }
  },
  {
    connection,
    limiter: {
      max: 1,
      duration: 500,
    },
  },
);


8::-->Parallelism and Concurrency

9::-->Retrying failing jobs


import { Queue } from 'bullmq';

const myQueue = new Queue('foo');

await queue.add(
  'test-retry',
  { foo: 'bar' },
  {
    attempts: 3,
    backoff: {
      type: 'fixed',
      delay: 1000,
    },
  },
);


await queue.add(
  'test-retry',
  { foo: 'bar' },
  {
    attempts: 8,
    backoff: {
      type: 'fixed',
      delay: 1000,
      jitter: 0.5,
    },
  },
);


await queue.add(
  'test-retry',
  { foo: 'bar' },
  {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
);


await queue.add(
  'test-retry',
  { foo: 'bar' },
  {
    attempts: 8,
    backoff: {
      type: 'exponential',
      delay: 3000,
      jitter: 0.5,
    },
  },
);


10::-->Returning job data


import { Queue, Worker } from 'bullmq';

const myWorker = new Worker('AsyncProc', async job => {
  const result = await doSomeAsyncProcessing();
  return result;


  import { Job, QueueEvents, Queue } from 'bullmq';

const queue = new Queue('AsyncProc');
const queueEvents = new QueueEvents('AsyncProc');

queueEvents.on('completed', async ({ jobId: string }) => {
  const job = await Job.fromId(queue, jobId);

  console.log(job.returnvalue);
});




11::-->Events

Create Custom Events



const queueName = 'customQueue';
const queueEventsProducer = new QueueEventsProducer(queueName, {
  connection,
});
const queueEvents = new QueueEvents(queueName, {
  connection,
});

interface CustomListener extends QueueEventsListener {
  example: (args: { custom: string }, id: string) => void;
}
queueEvents.on<CustomListener>('example', async ({ custom }) => {
  // custom logic
});

interface CustomEventPayload {
  eventName: string;
  custom: string;
}

await queueEventsProducer.publishEvent<CustomEventPayload>({
  eventName: 'example',
  custom: 'value',
});



122::: --->>>> Telemetry
Getting started

import { Queue } from 'bullmq'
import { BullMQOtel } from "bullmq-otel";

const queue = new Queue("myQueue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
  telemetry: new BullMQOtel("simple-guide"),
});

import { Worker } from "bullmq";
import { BullMQOtel } from "bullmq-otel";

const worker = new Worker(
  "myQueue",
  async (job) => {
    return 'some value'
  },
  {
    name: "myWorker",
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
    telemetry: new BullMQOtel("simple-guide"),
  }
);
Running Jaeger
Running a simple example


