const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const ratelimiter = require('express-rate-limit');

const userRoutes = require('./routes/userProfile');
const userAuth = require('./routes/user');
const homeSetting = require('./routes/homeSetting');
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/test';
var db = mongoose.connection;

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));
//to limit request from one source
const limiter = ratelimiter({
    windowMs: 15 * 60 * 1000,
    max: 50
});

app.use(limiter);


mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    next();
});
// rxr@h.in 1111

//routes
app.use(userRoutes);
app.use(userAuth);
app.use(homeSetting);

app.listen(port, function () {
    console.log('app listening on port 3000!');
});

