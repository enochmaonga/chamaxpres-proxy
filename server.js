const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5001;

const { MongoClient } = require("mongodb");

// Use cors middleware

// CORS configuration
app.use(
  cors({
    origin: ["https://kisiicentralsda.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// app.use(cors());
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define MongoDB schema and model (you may want to create a separate file for this)
const submissionSchema = new mongoose.Schema({
  name: String,
  amount: String,
  month: String,
  year: String,
});

// Specify the collection name as 'form'
const Submission = mongoose.model("Submission", submissionSchema, "contribution");

// Define routes
app.use("/member", require("./routes/member"));
app.use("/post", require("./routes/post"));
// app.use("/login", require("./routes/login"));
// app.use("/getmembers", require("./routes/getmembers"));
// app.use("/getcontributions", require("./routes/getcontributions"));

app.get("/", (req, res) => {
  res.send("Hello, chamaxpress! Your server is up and running.");
});

app.get("/get-contribution", async (req, res) => {
  try {
    const Contribution = await Contribution.find();
    res.json(Contribution);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/generate-api-key', (req, res) => {
  const apiKey = uuidv4();
  res.json({ apiKey });
});
console.log
// Route to generate JWT token
app.get('/generate-token', (req, res) => {
  const payload = {
      userId: 123,
      role: 'admin',
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

const url =
  "mongodb+srv://maongaenoch:P6QpXaBRe8zHA5gI@cluster0.gqnfqjq.mongodb.net/chamaxpress";

const client = new MongoClient(url);

// Start the server
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // Set a reference to your MongoDB database
    app.locals.db = client.db();

    // Start your Express server after connecting to MongoDB
    app.listen(port, "0.0.0.0", () => {
      console.log(`chamaxpress listening at http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}

connectToMongoDB();
