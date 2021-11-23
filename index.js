const express = require('express')
const { MongoClient } = require('mongodb');

require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xtza7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// run func started....
async function run() {
    try {
      await client.connect();
      const database = client.db("backpackTrekking");
      const trekCollection = database.collection("treks");
      const bookingCollection = database.collection("booking");

    //   GET API ....
    app.get('/treks', async (req, res) => {
        const cursor = trekCollection.find({});
        const events = await cursor.toArray(); 
        res.json(events);
    })

    //   POST API
    app.post('/treks', async (req, res) => {
        const newEvent = req.body;
        const result = await trekCollection.insertOne(newEvent);
        res.json(result);

    })
   

    app.post("/addBookings", (req, res) => {
      bookingCollection.insertOne(req.body).then((result) => {
        res.send(result);
      });
    });

    app.get  ("/myBookings/:email", async (req, res) => {
    const result = await bookingCollection.find({ email: req.params.email }).toArray();
    res.send(result);
        
    });
    // DELETE FROM BOOKING 
    app.delete('/myBookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id:req.params.id};
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
      
    })
  


//  ..........
    }
     finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Travel Side Server')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})