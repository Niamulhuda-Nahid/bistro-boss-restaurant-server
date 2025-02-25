const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0puja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const userColection = client.db("bistroDB").collection('users');
    const menuColection = client.db("bistroDB").collection('menu');
    const reviewColection = client.db("bistroDB").collection('reviews');
    const cartColection = client.db("bistroDB").collection('carts');

    // user related api
    app.post('/users', async(req, res)=>{
      const user = req.body;
      const result = await userColection.insertOne(user);
      res.send(result);
    })

    app.get('/menu', async(req, res) =>{
        const result = await menuColection.find().toArray();
        res.send(result);
    });

    app.get('/review', async(req, res) => {
      const result = await reviewColection.find().toArray();
      res.send(result);
    })

    // cart collection

    app.get('/carts', async(req, res)=>{
      const email = req.query.email;
      const query = {email : email}
      const result = await cartColection.find(query).toArray();
      res.send(result);
    })

    app.post('/carts', async(req, res)=>{
      const cartItem = req.body;
      const result = await cartColection.insertOne(cartItem);
      res.send(result)
    })

    app.delete('/carts/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await cartColection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('bistro boss restaurant running')
});

app.listen(port, ()=>{
    console.log(`Bistro Boss Restaurent Runnig On Port: ${port}`)
})