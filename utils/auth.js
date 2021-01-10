const jwt = require('jsonwebtoken');
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const bcrypt = require('bcrypt');

function createToken(email) {
    return jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET);
}


function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decoded;
    } catch (err) {
        return false;
    }
}

const encrypt = async (password) => {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
}

const decrypt = async (password, hashedPassword) => {
    const decrypt =  await bcrypt.compare(password, hashedPassword);
    return decrypt;
}


const isAuth = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const verified = verifyToken(token);
    console.log(verified);
    if(verified){
        return true;
    } else{
        res.status(401).send("Not authorized");
        return false;
    }
}


module.exports = { createToken, verifyToken, isAuth, encrypt, decrypt }
