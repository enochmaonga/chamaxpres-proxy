const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://maongaenoch:P6QpXaBRe8zHA5gI@cluster0.gqnfqjq.mongodb.net/chamaxpress";

async function initCounters() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("chamaxpress");
    const countersCollection = db.collection("counters");

    // Check if memberId counter already exists
    const existing = await countersCollection.findOne({ _id: "memberId" });
    if (existing) {
      console.log("Counter for 'memberId' already exists.");
    } else {
      // Insert the initial counter value
      await countersCollection.insertOne({
        _id: "memberId",
        seq: 0, // Start at 0; first call to getNextSequenceValue will return 1
      });
      console.log("Counter for 'memberId' initialized.");
    }
  } catch (error) {
    console.error("Error initializing counters:", error);
  } finally {
    await client.close();
  }
}

initCounters();
