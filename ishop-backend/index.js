const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');

const connectionString = 'mongodb://127.0.0.1:27017';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Get all products
app.get('/products', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const dbo = client.db('shopdb');
    const documents = await dbo.collection('tblproducts').find({}).toArray();
    res.send(documents);
    client.close();
  } catch (err) {
    console.error('Error in /products:', err);
    res.status(500).send({ error: 'Failed to fetch products', details: err.message });
  }
});

// Get product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const dbo = client.db('shopdb');
    const documents = await dbo.collection('tblproducts').find({ id: parseInt(req.params.id) }).toArray();
    res.send(documents);
    client.close();
  } catch (err) {
    console.error('Error in /products/:id:', err);
    res.status(500).send({ error: 'Failed to fetch product', details: err.message });
  }
});

// Get all customers
app.get('/getcustomers', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const dbo = client.db('shopdb');
    const documents = await dbo.collection('tblcustomers').find({}).toArray();
    res.send(documents);
    client.close();
  } catch (err) {
    console.error('Error in /getcustomers:', err);
    res.status(500).send({ error: 'Failed to fetch customers', details: err.message });
  }
});

// Admin registration
app.post('/adminregister', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const dbo = client.db('shopdb');
    const existingUser = await dbo.collection('tbladmins').findOne({ UserId: req.body.UserId });
    if (existingUser) {
      res.status(400).send({ error: 'UserId already taken' });
      client.close();
      return;
    }
    const data = {
      UserId: req.body.UserId,
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Password: await bcrypt.hash(req.body.Password, 10),
    };
    console.log('Received registration request:', data);
    const result = await dbo.collection('tbladmins').insertOne(data);
    console.log('Record Inserted:', result);
    res.status(201).send({ message: 'Admin registered successfully' });
    client.close();
  } catch (err) {
    console.error('Error in /adminregister:', err);
    res.status(500).send({ error: 'Registration failed', details: err.message });
  }
});

// Get all admins
app.get('/getadmin', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const dbo = client.db('shopdb');
    const documents = await dbo.collection('tbladmins').find({}).toArray();
    res.send(documents);
    client.close();
  } catch (err) {
    console.error('Error in /getadmin:', err);
    res.status(500).send({ error: 'Failed to fetch admins', details: err.message });
  }
});

// Admin login
app.post('/login', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const dbo = client.db('shopdb');
    const user = await dbo.collection('tbladmins').findOne({ UserId: req.body.UserId });
    if (user && await bcrypt.compare(req.body.Password, user.Password)) {
      res.status(200).send({ message: 'Login successful', UserId: user.UserId });
    } else {
      res.status(401).send({ error: 'Invalid credentials' });
    }
    client.close();
  } catch (err) {
    console.error('Error in /login:', err);
    res.status(500).send({ error: 'Login failed', details: err.message });
  }
});

app.listen(8080, () => {
  console.log('Server running on http://127.0.0.1:8080');
});