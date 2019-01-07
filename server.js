var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var index = require("./routes");
var students = require("./routes/students");
var dotenv = require('dotenv');
var path = require("path");

const mongoose = require('mongoose');

var app = express();

// Environment variables
let confPath = path.join(__dirname,'.env' );
dotenv.config({ path: confPath });

var port = process.env.PORT || 3000;
var connStr = process.env.COSMOSDB_CONNSTR;
connStr = connStr.replace('{COSMODDB_USER}', process.env.COSMODDB_USER);
connStr += process.env.COSMOSDB_DATABASE_NAME;
connStr += "?ssl=true&replicaSet=globaldb";

mongoose.connect(connStr, {
      auth: {
        user: process.env.COSMODDB_USER,
        password: process.env.COSMOSDB_PASSWORD
      }
})
.then(() => console.log('Connection to CosmosDB ' + process.env.COSMOSDB_DATABASE_NAME + ' successful'))
.catch((err) => console.error(err));

// View engine
var ejsEngine = require("ejs-locals");
app.engine("ejs", ejsEngine);           // support master pages
app.set("view engine", "ejs");          // ejs view engine

// Set static folder
app.use(express.static(path.join(__dirname, "client")));

// Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");         
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");         
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});           

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use("/", index);
app.use("/api", students);

app.listen(port, function() {
    console.log("Server started on port: " + port);
    console.log("Using mongo database on server: " + process.env.COSMOSDB_DATABASE_NAME);
});
