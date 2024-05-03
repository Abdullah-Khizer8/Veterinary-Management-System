const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Step 1: Define MongoDB connection parameters
const MONGO_URL = "mongodb+srv://final:fyp@cluster0.jlpfmot.mongodb.net";
const username = "final";
const password = "fyp";
const dbName = "VMS_DB";

// Step 2: Create a new MongoClient
const client = new MongoClient(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: false }));
// Step 3: Connect to MongoDB
client
  .connect()
  .then(() =>
  {
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("contact");
    const registerdb = db.collection("register");
    const logindb = db.collection("login");
    const appointmentsCollection = db.collection("appointments");

    app.post("/appointment", (req, res) =>
    {
      console.log("sasa")
      const { name, email, phone, date, appointment_time, office_type, enter_text } =
        req.body;

      const appointmentData = {
        name, email, phone, date, appointment_time, office_type, enter_text
      };

      // Insert the form data into the "appointments" collection
      appointmentsCollection
        .insertOne(appointmentData)
        .then(() =>
        {
          console.log("Appointment data inserted successfully!");
          res.send("Appointment data inserted successfully!");
        })
        .catch((error) =>
        {
          console.error("Error:", error);
          res.send("Error occurred while inserting appointment data.");
        });
    });

    // Handle form submission
    app.post("/", (req, res) =>
    {
      const { first_name, email, message } = req.body;
      const document = {
        first_name,
        email,
        message,
      };

      // Insert the form data into the collection
      collection
        .insertOne(document)
        .then(() =>
        {
          console.log("Data inserted successfully!");
          res.send("Data inserted successfully!");
        })
        .catch((error) =>
        {
          console.error("Error:", error);
          res.send("Error occurred while inserting data.");
        });
    });

    app.post("/register", (req, res) =>
    {
      const { name, email, pass } = req.body;
      const register = {
        name,
        email,
        pass,
      };

      // Insert the form data into the collection
      registerdb
        .insertOne(register)
        .then(() =>
        {
          console.log("Data inserted successfully!");
          res.send("Data inserted successfully!");
        })
        .catch((error) =>
        {
          console.error("Error:", error);
          res.send("Error occurred while inserting data.");
        });
    });

    app.post("/login", (req, res) =>
    {
      const { email, pass } = req.body;
      const login = {
        email,
        pass,
      };

      // Insert the form data into the collection
      registerdb
        .findOne({ email })
        .then((user) =>
        {
          if (!user)
          {
            // User not found
            res.send("User not found");
            return;
          }

          // Check if the password matches
          if (user.pass !== pass)
          {
            // Incorrect password
            res.send("Incorrect password");
            return;
          }

          // Password matches, do something with the user data
          console.log("User:", user);
          res.send("Logged in successfully!");
        })
        .catch((error) =>
        {
          console.error("Error:", error);
          res.send("Error occurred while fetching data.");
        });
    });

    // Start the server
    app.listen(port, () =>
    {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) =>
  {
    console.error("Error connecting to MongoDB:", error);
  });
