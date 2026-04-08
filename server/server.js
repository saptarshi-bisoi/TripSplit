const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));

const PORT = process.env.PORT || 5000;

const { MongoMemoryServer } = require('mongodb-memory-server');

async function startServer() {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    await mongoose.connect(uri);
    console.log(`[TripSplit] In-Memory MongoDB Connected Successfully!`);
    
    app.listen(PORT, () => console.log(`[TripSplit] API Running on Port ${PORT}`));
  } catch (err) {
    console.error('Database connection critical error:', err);
  }
}

startServer();