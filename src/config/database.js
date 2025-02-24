const mongoose = require("mongoose");

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://ankurishiva:KlCIoMzZPzgn2EQ1@clusterda.cjwxu.mongodb.net/")
}

 module.exports = connectDB;
