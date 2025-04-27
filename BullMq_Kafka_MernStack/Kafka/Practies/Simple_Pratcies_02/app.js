const express = require("express");
const { Kafka } = require('kafkajs')
const router = require('./routes/router');

const app = express();

const port = 9000;

app.use(express.json())
app.use(router);




app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})


/// Command  Line ........ 


// 1::  docker run -p 2181:2181 zookeeper


// 2::docker run -p 9092:9092 \
// -e KAFKA_ZOOKEEPER_CONNECT=192.168.29.78:2181 \
// -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT:192.168.29.78:9092 \
// -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
// confluentinc/cp-kafka

// docker run -p 2181:2181 zookeeper

// docker-compose up

//1::nodemon app.js 

//2::nodemon admin.js 

//3::nodemon  producer.js 

//4::nodemon consumer.js



