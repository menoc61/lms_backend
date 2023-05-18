const express = require("express");
const dbConnect = require('./config/dbconnect');
const bodyParser = require('body-parser');
const userRouter = require("./routes/userRoutes.js")
const { notFound, handleError } = require('./middlewares/errorhandler');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;


dbConnect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res)=>{
    res.send("Hello bro welcome back to the server!");
});
 

app.use("/api/user", userRouter);

app.use(notFound);
app.use(handleError);

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
})