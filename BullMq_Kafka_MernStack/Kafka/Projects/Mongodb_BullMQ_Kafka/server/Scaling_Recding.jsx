📈 Scaling Recommendations
Component	Current Limitation	Scaling Fix
Kafka	Single consumer	Multiple consumers + partitions
BullMQ	Single worker	Multiple workers + concurrency
Redis	Single connection	Connection pooling
MongoDB	Per-job inserts	Batch inserts + indexing
API	Direct Kafka producer	Load-balanced API instances