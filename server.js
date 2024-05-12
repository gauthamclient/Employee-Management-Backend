const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

// Use the cors middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection URI
const uri = "mongodb+srv://gauthamclient:iYkB7zWkipPh1Omr@employee.kuzz0hs.mongodb.net/?retryWrites=true&w=majority&appName=Employee";

// Database name
const dbName = 'employee_management';

// Connect to MongoDB
MongoClient.connect(uri)
  .then(client => {
    console.log("Connected to MongoDB");
    const db = client.db(dbName);

    // Define routes, middleware, etc.
    app.get('/', (req, res) => {
      res.send('Hello, Express!');
    });

    // Route to fetch data from the "admin" collection
    app.get('/admin', async (req, res) => {
      const collectionName = 'admin'; // Name of the admin collection
      try {
        // Fetch data from the "admin" collection
        const collection = db.collection(collectionName);
        const data = await collection.find({}).toArray();
        res.json(data);
      } catch (error) {
        console.error(`Error fetching data from collection "${collectionName}":`, error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Route to fetch data from the "employee" collection
    app.get('/employee', async (req, res) => {
      const collectionName = 'employee'; // Name of the employee collection
      try {
        // Fetch data from the "employee" collection
        const collection = db.collection(collectionName);
        const data = await collection.find({}).toArray();
        res.json(data);
      } catch (error) {
        console.error(`Error fetching data from collection "${collectionName}":`, error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Route to add data to the "employee" collection
    app.post('/add_employee', async (req, res) => {
      const collectionName = 'employee'; // Name of the employee collection
      const newData = req.body; // Data sent in the request body

      try {
        // Ensure newData is an object
        if (typeof newData !== 'object' || newData === null) {
          throw new Error('Invalid data format');
        }

        // Insert new data into the "employee" collection
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(newData);

        // Log the result object
        console.log('InsertOne result:', result);

        // Check if documents were inserted successfully
        if (result && result.insertedId) {
          res.status(201).json(result.ops[0]); // Return the inserted document
        } else {
          throw new Error('No documents inserted');
        }
      } catch (error) {
        console.error(`Error adding data to collection "${collectionName}":`, error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Route to fetch tasks from the "task" collection
    app.get('/tasks', async (req, res) => {
      const collectionName = 'task'; // Name of the task collection
      try {
        // Fetch tasks from the "task" collection
        const collection = db.collection(collectionName);
        const tasks = await collection.find({}).toArray();
        res.json(tasks);
      } catch (error) {
        console.error(`Error fetching tasks from collection "${collectionName}":`, error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post('/add_task', async (req, res) => {
      const collectionName = 'task'; // Name of the tasks collection
      const newData = req.body; // Data sent in the request body
    
      try {
        // Ensure newData is an object
        if (typeof newData !== 'object' || newData === null) {
          throw new Error('Invalid data format');
        }
    
        // Insert new data into the "tasks" collection
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(newData);
    
        // Log the result object
        console.log('InsertOne result:', result);
    
        // Check if documents were inserted successfully
        if (result && result.insertedId) {
          res.status(201).json(result.ops[0]); // Return the inserted document
        } else {
          throw new Error('No documents inserted');
        }
      } catch (error) {
        console.error(`Error adding data to collection "${collectionName}":`, error);
        res.status(500).send("Internal Server Error");
      }
    });
    
    // Start the server
    const port = 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });
