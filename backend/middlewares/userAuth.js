const jwt = require('jsonwebtoken');
const { JWT_ACCESS_TOKEN } = require("../config/config");

var bcrypt = require('bcryptjs');

const hashPassword = (inputPassword) => {
    const saltRounds = 10;
    return bcrypt.hashSync(inputPassword, saltRounds);
}

const comparePassword = (inputPassword, databasePassword) => {
    return bcrypt.compareSync(inputPassword, databasePassword)
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({message: "Status 401: Unauthorised to access data!"});
    }
    
    jwt.verify(token, JWT_ACCESS_TOKEN, function(err, user) {
        if (err) {
            return res.status(403).json({message: "Status 403: Forbidden to access data!"});
        }
        
        req.user = user;
        next();
    });
};

const createToken = (user) => {
    return jwt.sign({ 
        user: user._id, 
        role: user.role 
    }, 
    JWT_ACCESS_TOKEN, 
    {
        expiresIn: "24h"
    });
}

const adminRole = "admin";

const verifyRole = (req, res, next) => {
    const inputRole = req.user.role;

    if (inputRole.toLowerCase() !== adminRole) {
        return res.status(403).json("Invalid role detected, no admin rights to retrieve data!");
    }
    next();
}

module.exports = { authenticateToken, createToken, hashPassword, comparePassword, verifyRole}; 