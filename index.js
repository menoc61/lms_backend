const express = require("express");
const dbConnect = require('./config/dbconnect');
const bodyParser = require('body-parser');
const userRouter = require("./routes/userRoutes.js")
const googleRouter = require("./routes/googleRoutes.js")
const { notFound, handleError } = require('./middlewares/errorhandler');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
const passportSetup = require("./utils/passport");

dbConnect();
app.use(session({
    resave: false,
    saveUninitialized:false,
    secret: process.env.JWT_SECRET,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 12 * 60 * 60,
    }),
})
);

app.use(passport.initialize());
app.use(passport.session());



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res)=>{
    res.send(`<a href="http://localhost:4000/google">LOGIN WITH GOOGLE</a>`);
});
 

app.use("/api/user", userRouter);
app.use("/", googleRouter);

app.use(notFound);
app.use(handleError);

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
})