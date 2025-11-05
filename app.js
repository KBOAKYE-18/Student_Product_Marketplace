require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Routes = require ('./Routes');
const app = express();


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const dbURI = `mongodb+srv://boakyeemmanueleinstein_db_user:${process.env.DB_PASSWORD}@cluster1.qco0fdf.mongodb.net/?appName=cluster1`;
mongoose.connect(dbURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("DB connection error:", err));




app.use('/',Routes);

app.listen(3000,()=>{
  console.log('Server is running');
});



