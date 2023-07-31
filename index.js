const express = require('express')
const app = express()
const port = 3000
var cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://dipthobracu02:RjvZC5tIDKECUFcn@cluster0.ro8ugkx.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    let classCollection = client.db('CSE470').collection('classes');
    let userCollection = client.db('CSE470').collection('users');
    let bookedClassCollection =  client.db('CSE470').collection('bookedClasses');
    app.get('/classes', async (req, res)=>{
      let result = await classCollection.find().toArray();
      res.send(result);
    })

    app.post('/users', async (req, res)=>{
      let user = req.body;
      let query = {email : user.email};
      let oldUser = await userCollection.findOne(query);
      if(oldUser){
        return
      }
      let result = await userCollection.insertOne(user);
      res.send(result);
      
    })

    app.get('/isAdmin/:email', async (req, res)=>{
      let mail = req.params.email;
      let filter = {email : mail}
      let user = await userCollection.findOne(filter);
      let result = { isAdmin : user?.role == 'admin'}
      res.send(result);
    })

    app.get('/isInstructor/:email', async (req, res)=>{
      let mail = req.params.email;
      let filter = {email : mail}
      let user = await userCollection.findOne(filter);
      let result = { isInstructor : user?.role == 'instructor'}
      res.send(result);
    })

    app.get('/classes/approved',  async (req, res)=>{
      let filter ={ status : 'approved'}
      let result = await classCollection.find(filter).toArray()

      res.send(result)
    })

    app.post('/addClass', async(req, res)=>{
      let getClass = req.body;
      let result = await bookedClassCollection.insertOne(getClass)
      res.send(result)
    })

    app.get('/bookedClasses',  async(req, res)=>{
      let mail = req.query.email
      let filter = {email : mail}
      let result = await bookedClassCollection.find(filter).toArray();
      res.send(result)
    })

    app.delete('/bookedClasses/:id', async(req, res)=>{
    
      let id = req.params.id
      // let mail = req.query.email
     
      // console.log(id);
      let filter = { _id : new ObjectId(id)}
      
       let result = await bookedClassCollection.deleteOne(filter);
       res.send(result)
    })

    app.get('/users',  async (req, res)=>{
      let result = await userCollection.find().toArray();
      res.send(result)
    })

    app.put('/users/a/:id', async (req, res)=>{
      let id = req.params.id;
      // console.log(id);
      let filter = { _id : new ObjectId(id)};
      let updateRole = {
        $set: {
          role : 'admin'
        }
      }
      let result = await userCollection.updateOne(filter, updateRole);
      res.send(result);

    })
    app.put('/users/s/:id',  async (req, res)=>{
      let id = req.params.id;
      // console.log(id);
      let filter = { _id : new ObjectId(id)};
      let updateRole = {
        $set: {
          role : 'student'
        }
      }
      let result = await userCollection.updateOne(filter, updateRole);
      res.send(result);

    })
    app.put('/users/i/:id', async (req, res)=>{
      let id = req.params.id;
      // console.log(id);
      let filter = { _id : new ObjectId(id)};
      let updateRole = {
        $set: {
          role : 'instructor'
        }
      }
      let result = await userCollection.updateOne(filter, updateRole);
      res.send(result);

    })

    
    app.post('/classes', async (req, res)=>{
      let newClass = req.body;
      let result = await classCollection.insertOne(newClass)

      res.send(result)

    })

    app.put('/classes/approve/:id',  async(req, res)=>{
      let id = req.params.id;
      let filter = {_id : new ObjectId(id)}
      // let getClass = await classCollection.findOne(filter);
      let updateStatus = {
        $set : {
          status : 'approved'
        }
      }
      let result = await classCollection.updateOne(filter,updateStatus)
      res.send(result)
    })
    
    app.put('/classes/deny/:id',  async(req, res)=>{
      let id = req.params.id;
      let filter = {_id : new ObjectId(id)}
      // let getClass = await classCollection.findOne(filter);
      let updateStatus = {
        $set : {
          status : 'denied'
        }
      }
      let result = await classCollection.updateOne(filter,updateStatus)
      res.send(result)
    })
    
    app.put('/classes/feedback/:id',  async(req, res)=>{
      let id = req.params.id;
      let feedback = req.body;
      let filter = {_id : new ObjectId(id)}
      // let getClass = await classCollection.findOne(filter);
      let updateStatus = {
        $set : {
          feedback : feedback.feedback
        }
      }
      let result = await classCollection.updateOne(filter,updateStatus)
      res.send(result)
    })

    app.get('/instructorClass',  async(req, res)=>{
      let mail = req.query.email
      // console.log(mail);
      let filter = {email : mail};
      let result = await classCollection.find(filter).toArray();
      res.send(result)

    })


    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})