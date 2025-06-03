✅ Step-by-Step Code Execution Flow
🔧 1. Application Initialization (main file)
File: index.js (or your main entry file)

Connects middleware: cors, rateLimiter, bodyParser

Mounts router

Calls startServer(app, port) to enable clustering

🔁 2. Clustering & Worker Setup
File: ./Cluster/clust.js

Master process forks multiple workers (based on CPU cores)

Each worker:

Connects to MongoDB using connectDB()

Starts Express server

Handles requests and routes (e.g., /v1/North)

🌐 3. Routing Logic
File: ./routes/router.js

Defines routes like:

POST /v1/North → handled by controller/North.js

🚀 4. Kafka Message Sending
File: ./controller/North.js

Receives { name, loc } in POST body

Calls sendNorthMessage() → sends message to north-updates topic

File: ./producer/producer_north.js

Initializes Kafka producer

Sends JSON message with { name, loc } to partition 0 of the north-updates topic

🧿 5. Kafka Consumer + Queueing
File: ./consumer/northConsumer.js

Consumes from north-updates topic

On message receive:

Parses message

Adds job to BullMQ Queue (NotificationQueue)

With retry, delay, and backoff

📬 6. Worker Processes Job (BullMQ)
File: ./workers/worker.js

Listens on NotificationQueue

Executes sendEmail job

Simulates delay (2 seconds)

Logs ✅ Email sent!

🧠 7. Redis Integration
Used in:

BullMQ queue and worker

Possibly also in rateLimiter middleware (optional)

🧵 8. Graceful Shutdown
On SIGINT, shuts down Kafka producer and exits safely



project-root/
├── index.js                      # Main app entry
├── Cluster/
│   └── clust.js                 # Cluster logic
├── controller/
│   ├── North.js                 # Route handler logic
│   └── South.js                 # (Similar to North)
├── routes/
│   └── router.js                # API route definitions
├── db/
│   └── conn.js                  # MongoDB connection
├── rateLimite/
│   └── rate.js                  # Rate limiting middleware
├── Redis/
│   └── redisClient.js           # Redis client (for BullMQ, caching)
├── producer/
│   └── producer_north.js        # Kafka producer
├── consumer/
│   └── northConsumer.js         # Kafka consumer
├── queues/
│   └── noticationQueu.js        # BullMQ queue
├── workers/
│   └── worker.js                # BullMQ worker
├── client/
│   └── client.js                # Kafka client
└── admin/
    └── createTopics.js          # Kafka admin (topic setup)
