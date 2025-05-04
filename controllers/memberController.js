const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://maongaenoch:P6QpXaBRe8zHA5gI@cluster0.gqnfqjq.mongodb.net/chamaxpress";

async function initDB() {
  const client = new MongoClient(uri);
  await client.connect();

  console.log("MongoDB connection established");
  const database = client.db("chamaxpress");
  return database;
}

// Counter function
async function getNextSequenceValue(database, sequenceName) {
    const counters = database.collection("counters");
  
    const result = await counters.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { seq: 1 } },
      {
        upsert: true,
        returnDocument: "after",
      }
    );
  
    console.log("Sequence update result:", JSON.stringify(result, null, 2));
  
    if (!result || !result.value) {
      // Fallback in case upsert didn't return document
      const fallback = await counters.findOne({ _id: sequenceName });
      if (!fallback || fallback.seq === undefined) {
        throw new Error("Failed to get or create sequence counter.");
      }
      return fallback.seq;
    }
  
    if (result.value.seq === undefined) {
      throw new Error("Document returned, but 'seq' field is missing.");
    }
  
    return result.value.seq;
  }
  

const isEntryDuplicate = async (collection, members) => {
  const existingEntry = await collection.findOne({
    firstName: members.firstName,
    middleName: members.middleName,
    lastName: members.lastName,
    phone: members.phone,
    email: members.email,
  });

  return existingEntry !== null;
};

const newMemberForm = async (req, res) => {
  try {
    const { firstName, middleName, lastName, phone, email } = req.body;

    // Validate required fields
    if (!firstName || !middleName || !lastName || !phone || !email) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled." });
    }

    const database = await initDB();
    const membersCollection = database.collection("members");

    // Generate memberNo safely
    const nextSeq = await getNextSequenceValue(database, "memberId");
    const memberNo = nextSeq.toString().padStart(4, "0"); // e.g., "0001"

    const members = {
      firstName,
      middleName,
      lastName,
      phone,
      email,
      memberNo,
    };

    // Check for duplicates
    const duplicate = await isEntryDuplicate(membersCollection, members);
    if (duplicate) {
      return res.status(409).json({
        error: "Duplicate entry found. Please check your details.",
      });
    }

    // Insert new member
    await membersCollection.insertOne(members);

    res.status(201).json({
      message: "Member created successfully.",
      memberNo: memberNo,
    });
  } catch (error) {
    console.error("Error creating member:", error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting the form." });
  }
};

module.exports = { newMemberForm };
