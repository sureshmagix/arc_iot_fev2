const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// MongoDB connection URI
const uri = "mongodb://admin:amma1508@13.233.116.176:27017/arcdb?authSource=admin";

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser:
