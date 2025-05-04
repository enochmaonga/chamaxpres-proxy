const { MongoClient } = require("mongodb");
const bcryptjs = require("bcryptjs");

const uri =
  "mongodb+srv://maongaenoch:P6QpXaBRe8zHA5gI@cluster0.gqnfqjq.mongodb.net/chamaxpress";

async function initDB() {
  const client = new MongoClient(uri);
  await client.connect();

  console.log("MongoDB connection established");
  const database = client.db("chamaxpress");
  return database;
}

const isEntryDuplicate = async (collection, contribution) => {
  const existingEntry = await collection.findOne({
    name: contribution.name,
    amount: contribution.amount,
    month: contribution.month,
    year: contribution.year,
  });

  return existingEntry !== null;
};


const memberForm = async (req, res) => {
  try {
    const {
      name,
      amount,
      month,
      year,
    } = req.body;

    if (!name || !amount || !month || !year) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled." });
    }

    const contribution = { name, amount, month, year };

    const database = await initDB();
    const collection = database.collection("contribution");

    const duplicate = await isEntryDuplicate(collection, contribution);
    if (duplicate) {
      return res.status(409).json({
        error: "Duplicate entry found. Please check your details.",
      });
    }

    const result = await collection.insertOne(contribution);

    res.status(201).json({
      message: "Amount submitted successfully.",
    });
  } catch (error) {
    console.error("Error saving form data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting the form." });
  }
};


module.exports = { memberForm };
