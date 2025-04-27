const { Queue } = require('bullmq');

const queue = new Queue('my-queue', {
  connection: {
    host: 'localhost',
    port: 6379
  }
});

async function addJob() {
  let res=await queue.add('email to jugal sharma' , 
    {email:"jugal sharma" ,
       subject:"fuck you all" , 
      body:"hey jugal welcome to my channel"
      }

      , { delay: 5000 });

  console.log('Job added' , res);
}

addJob();
