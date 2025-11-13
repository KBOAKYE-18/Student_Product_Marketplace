require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Routes = require ('./Routes');
const app = express();


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const connect_DB = async ()=>{
  try {
    const dbURI = `mongodb+srv://boakyeemmanueleinstein_db_user:${process.env.DB_PASSWORD}@cluster1.qco0fdf.mongodb.net/?appName=cluster1`;
    await mongoose.connect(dbURI);
    console.log("Connected to MongoDB");

    app.use('/',Routes);

    app.listen(3000,()=>{
      console.log('Server is running');
    });

  } catch (error) {
    console.log(`Error message:${error}`);
    process.exit(1);
  }
  
  
}









