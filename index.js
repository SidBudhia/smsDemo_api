const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();


const router = require("./router");



app.use(cors());
app.get("/", (req,res) => res.send('healthy'));
app.use(express.json());

app.use("/api/", router);

const port = process.env.PORT || 8001;

app.listen(port, ()=>{
    console.log("Server is running at:", port);
});