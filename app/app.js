const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoos = require("mongoose");
const { default: mongoose } = require("mongoose");
const directorRoutes = require("../api/routes/directors");
const movieRoutes = require("../api/routes/movies");

app.use(morgan("dev"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "POST, PUT, GET, PATCH, DELETE");
    }
    next();
});

app.get("/", (req, res, next) => {
    res.status(201).json({
        message: "Service is now up and running",
        method: req.method
    })
});

app.use("/directors", directorRoutes);
app.use("/movies", movieRoutes);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error:{
            message: error.message,
            status: error.status
        }
    });
});

mongoose.connect(process.env.mongoLink, (err) => {
    if(err){
        console.error("Error: ", err.message);
    }
    else{
        console.log("MongoDB connection has been successful");
    }
});

module.exports = app;