const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = 5000;

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sady.wln4gaa.mongodb.net/?appName=sady`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const database = client.db("petService");
    const petServices = database.collection("services");
    const orderCollections = database.collection("orders");

    // post or save service to DB
    app.post("/services", async (req, res) => {
      const data = req.body;
      const date = new Date();
      data.createdAt = date;

      console.log(data);

      const result = await petServices.insertOne(data);
      res.send(result);
    });

    // Get service from DB
    app.get("/services", async (req, res) => {
      const { category } = req.query;
      const query = {};
      if (category) {
        query.category = category;
      }
      const result = await petServices.find(query).toArray();
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const query = { _id: new ObjectId(id) };

      const result = await petServices.findOne(query);
      res.send(result);
    });

    app.get("/my-services", async (req, res) => {
      const { email } = req.query;
      const query = { email: email };
      const result = await petServices.find(query).limit(6).toArray();
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      console.log(id);
      console.log(updateData);

      const query = { _id: new ObjectId(id) };

      const updateDoc = {
        $set: updateData,
      };
      const result = await petServices.updateOne(query, updateDoc);

      res.send(result);
    });

    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await petServices.deleteOne(query);
      res.send(result);
    });

    app.post("/orders", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await orderCollections.insertOne(data);
      res.send(result);
    });

    app.get("/orders", async (req, res) =>{
        const result = await orderCollections.find().toArray();
        res.status(200).send(result)
    })


    // pdf create and download
    

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello, Developers");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
