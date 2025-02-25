const mongoose = require("mongoose");

const connectDB = async() => {
    //await mongoose.connect("mongodb+srv://ankurishiva:KlCIoMzZPzgn2EQ1@clusterda.cjwxu.mongodb.net/");
    await mongoose.connect("mongodb://ankurishiva:KlCIoMzZPzgn2EQ1@clusterda-shard-00-00.cjwxu.mongodb.net:27017,clusterda-shard-00-01.cjwxu.mongodb.net:27017,clusterda-shard-00-02.cjwxu.mongodb.net:27017/?replicaSet=atlas-2c5dpo-shard-0&ssl=true&authSource=admin");
}

 module.exports = connectDB;
