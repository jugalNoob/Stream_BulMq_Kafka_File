const express = require("express");
const { Kafka } = require('kafkajs')
const router = require('./routes/router');
require('dotenv').config();

require('./db/conn')
const app = express();

const port = 9000;

app.use(express.json())
app.use(router);




app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
