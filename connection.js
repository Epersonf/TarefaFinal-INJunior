const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const config = require('./config')

mongoose.connect(config.mongoUrl, { useNewUrlParser: true });

const db = mongoose.connection;

module.exports = {
    io,
    app,
    server,
    db,
}


/* const CONNECTION_KEY = Symbol.for("ambaya.connection");

// check if the global object has this symbol
// add it if it does not have the symbol, yet
// ------------------------------------------

var globalSymbols = Object.getOwnPropertySymbols(global);
var hasConnection = (globalSymbols.indexOf(CONNECTION_KEY) > -1);

if (!hasConnection) {
    global[CONNECTION_KEY] = {
        io,
        app,
        server
    }
}

// define the singleton API
// ------------------------

var connection = {};

Object.defineProperty(connection, "instance", {
    get: function () {
        return global[CONNECTION_KEY];
    }
});

// ensure the API is never changed
// -------------------------------

Object.freeze(connection);

// export the singleton API only
// -----------------------------

module.exports = connection; */