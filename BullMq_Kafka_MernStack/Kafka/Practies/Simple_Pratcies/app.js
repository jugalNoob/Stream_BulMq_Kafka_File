const express = require("express");
const { Kafka } = require('kafkajs')
const router = require('./routes/router');
const app = express();

const port = 9000;

app.use(express.json())
app.use(router);

// app.get("/", (req, res) => {
//     res.send("Hello World");
// });



app.listen(port,()=>{

    console.log(`Server is running on port ${port}`)
})



/// Command  Line ........ 

// docker run -p 2181:2181 zookeeper

// docker-compose up

//1::nodemon app.js 

//2::nodemon admin.js 

//3::nodemon  producer.js 

//4::nodemon consumer.js
