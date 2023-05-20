const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json())
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zuw1kb6.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        const db = client.db('ToyShop').collection('toys')




        app.get('/mytoys', async (req, res) => {
            let query = {};
            query = { sellerEmail: req.query.email }
            const result = await db.find(query).toArray()
            res.send(result)
        })

        // toy sort



        app.get('/alltoys/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) }
            const result = await db.find(query).toArray()
            res.send(result)
        })

        app.post('/addtoys', async (req, res) => {
            const data = {
                name: req.body.name,
                image: req.body.image,
                price: parseInt(req.body.price),
                rating: parseInt(req.body.rating),
                quantity: parseInt(req.body.quantity),
                description: req.body.description,
                category: req.body.category,
                sellerName: req.body.sellerName,
                sellerEmail: req.body.sellerEmail,
            }
            const result = await db.insertOne(data)
            res.send(result)
        })

        app.put('/', async (req, res) => {
            const filter = { _id: new ObjectId(req.body.id) }
            const options = { upsert: true }
            const update = {
                $set: {
                    name: req.body.name,
                    price: req.body.price,
                    quantity: req.body.quantity,
                    description: req.body.description,
                    rating: req.body.rating
                }
            }
            const result = await db.updateOne(filter, options, update)
            res.send(result)
        })

        app.delete('mytoys', async (req, res) => {
            const query = { _id: new ObjectId(req.body.data) }
            const result = await db.deleteOne(query)
            res.send(result)
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



app.get('/', (req, res) => {
    res.send('Toy Shop is running')
})

app.listen(port, () => {
    console.log(`Toy Shop Server is running on port ${port}`)
})