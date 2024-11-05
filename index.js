const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7tkml.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    const database = client.db("databaseOfJurney");
    const collectionOfJurney = database.collection("Spot");
    try {
        await client.connect();

        app.get('/journey', async (req, res) => {
            const coures = collectionOfJurney.find()
            const result = await coures.toArray()
            res.send(result)

        })
        app.get('/alltourists/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const tourist = await collectionOfJurney.findOne(query);
            res.send(tourist);

        });
        app.get('/mylist/:email', async (req, res) => {
            console.log(req.params.email);
            const result = await collectionOfJurney.find({ email: req.params.email }).toArray();
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const quary = { _id: new ObjectId(id) }
            const result = await collectionOfJurney.deleteOne(quary)
            res.send(result)
        })

        app.put('/update/:id', async (req, res) => {
            const id = req.param.id
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatecoffe = req.body
            const userspot = {
                // spotName, location, averageCost, travleTime, countryName, shortDes, seasonality, totalvisit, url, rating
                $set: {
                    spotName: updatecoffe.spotName,
                    location: updatecoffe.location,
                    averageCost: updatecoffe.averageCost,
                    travleTime: updatecoffe.travleTime,
                    countryName: updatecoffe.countryName,
                    shortDes: updatecoffe.shortDes,
                    seasonality: updatecoffe.spotName,
                    totalvisit: updatecoffe.totalvisit,
                    url: updatecoffe.url,
                    rating: updatecoffe.rating,

                }
            }
            const result = collectionOfJurney.updateOne(filter, userspot, option)
            res.send(result)
        }





        app.post('/journey', async (req, res) => {
            const user = req.body
            const result = await collectionOfJurney.insertOne(user)
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
    res.send('Hello World! and happpy journey')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})