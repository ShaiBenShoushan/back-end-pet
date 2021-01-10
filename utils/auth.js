const jwt = require('jsonwebtoken');
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const bcrypt = require('bcrypt');

// const secretTokenKey = 'do39ld08d#$';


const ADMIN_STATUS = 2;

function createToken(email) {
    return jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET);
}


function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decoded;
    } catch (err) {
        console.log("errorzzzzz");
        return false;
    }
}




/*returns user object from db*/
// const getUserFromDB = (email) => {
//     console.log(email, "myemail");
//     if (!email) return {}
//     return { email, status: 2 };
// }

// function isAdmin (req, res, next){
//     const token = req.headers.authorization.split(' ')[1];
//     verifyToken(token);
// }

const encrypt = async (password) => {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
}

const decrypt = async (password, hashedPassword) => {
    const decrypt =  await bcrypt.compare(password, hashedPassword);
    return decrypt;
}

const isAdmin = (req, res, next) => {
    console.log(req.body, "im here");
    const token = req.headers.authorization.split(' ')[1];
    const user = verifyToken(token);
    console.log(user.password, req.body.password);
    if(user.email === req.body.email ){
        console.log(true);
    } else{
        console.log(false);
    }
    // const userObj = getUserFromDB(user);
    // console.log('hello', userObj, user);
    // console.log(verifyToken(token));
    // if (userObj.status === ADMIN_STATUS) {
    //     next();
    // } else {
    //     res.status(403).send('Error, Forbidden');
    // }
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
    // const userObj = getUserFromDB(user);
    // console.log('hello', userObj, user);
    // console.log(verifyToken(token));
    // if (userObj.status === ADMIN_STATUS) {
    //     next();
    // } else {
    //     res.status(403).send('Error, Forbidden');
    // }
}

// function isAuthNoPass(req, res, next) {
//     const token = req.headers.authorization.split(' ')[1];
//     const user = verifyToken(token);
//     // console.log("nibbadibbadawg", user);
//     if(user) return true;
//     return false;
// }

module.exports = { createToken, verifyToken, isAdmin, isAuth, encrypt, decrypt }
