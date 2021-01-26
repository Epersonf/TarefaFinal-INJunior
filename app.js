const express = require("express");
const cors = require('cors');
const useRoutes = require("./src/routes/routeManager");
const mongoManager = require("./src/database/mongoManager");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const initializationController = require("./src/controller/initializationController/initializationController");

//load environment
dotenv.config();

//make server core
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//connect to database and set defaults
mongoManager.connectToDatabase(process.env.MONGODB_URI);
initializationController.initialize();

//start routes
useRoutes(app);

//listen to port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is now online at port ${process.env.PORT || port}`);
});