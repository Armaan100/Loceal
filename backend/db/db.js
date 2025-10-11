const mongoose = require("mongoose");
const URI = process.env.MONGO_URI;

function connectDB(){
    mongoose.connect(URI)
    .then(()=>{
        console.log("Connected to database successfully");
    })
    .catch((err)=>{
        console.log("Error connecting to database:", err);
    });
}

module.exports = connectDB;
