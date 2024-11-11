const express = require("express");
const dotenv = require("dotenv")
const connectDB = require("./config/db");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({}));
app.use(express.json({extended: true}));

dotenv.config({
    path: "./config/config.env"
});
connectDB();


app.use('/api/potholescanner', require('./routes/user'));

app.listen(port, console.log(`Server started on port: ${port}`));

