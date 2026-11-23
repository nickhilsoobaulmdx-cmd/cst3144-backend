const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Load the password from config.env
require("dotenv").config({ path: "./config.env" });

// MongoDB connection
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_PREFIX +
            process.env.MONGODB_USERNAME + ":" +
            process.env.MONGODB_PASSWORD +
            process.env.MONGODB_URL;
const client = new MongoClient(uri);
const db = client.db("afterschool");

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
connectToMongoDB();

// Logger (morgan)
var morgan = require('morgan')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Logger middleware: outputs all requests to the console
app.use((req, res, next) => {
    console.log('Incoming request: ' + req.method + ' from: ' + req.url);
    next();
});

// Static file middleware: returns lesson images
app.use('/images', express.static(path.join(__dirname, 'images')));

// If the image does not exist
app.use('/images', (req, res) => {
    res.status(404).send("Image not found !");
});

// 
// GET: home page message
app.get('/', function(request, response) {
    response.send("Welcome to the After School Lessons API. Try /lessons");
});

// GET: all lessons
app.get('/lessons', async function(request, response) {
    try {
        let collection = await db.collection("lessons");
        let results = await collection.find({}).toArray();
        response.send(results);
    } catch (err) {
        response.status(500).send("Error getting lessons");
    }
});

// POST: save a new order
app.post("/orders", async function(request, response){
    var body = request.body;
    console.log(body);
    let collection = await db.collection("orders");
    let result = await collection.insertOne(body);
    response.send(result);
});

// PUT: update any attribute of a lesson (e.g. spaces)
app.put("/lessons/:_id", async function(request, response) {
    let collection = await db.collection("lessons");
    const query = { _id: new ObjectId(request.params._id) };
    const updates = {
        $set: request.body
    };
    let result = await collection.updateOne(query, updates);
    response.send(result);
});

// Any other address
app.use((req, res) => {
    res.status(404).send("Page not found !")
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
})