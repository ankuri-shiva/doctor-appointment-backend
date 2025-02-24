const express = require('express');
const connectDB = require('./config/database');
const app = express();
const port = 7000;

app.get("/", (req, res) => {
    console.log('Hello World');
    res.send('Hello World');
});


connectDB().then(() => {
    console.log("Database connected");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
});