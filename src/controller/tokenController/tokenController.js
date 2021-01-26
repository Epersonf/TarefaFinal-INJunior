const jwt = require("jsonwebtoken");

const generateToken = (params = {}) => {
    return jwt.sign(params,
        process.env.SECRET || "490bc6115cc2db9292b33dbb6cd0285e",
        86400);
}

module.exports = { generateToken };