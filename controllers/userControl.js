
const { validateSignup } = require("../utils/validation");

const { createToken, isAuth, encrypt, decrypt } = require('../utils/auth');

const mongo = require("../models/Mongo");


async function addNewMongoUser(req, res, next) {
  const isValid = validateSignup(req);
  try {
    if (isValid) {
      const { firstName, lastName, email, phoneNumber, bio, password } = req.body;
      const checkEmailExists = await mongo.checkIfEmailExists(email);
      if (!checkEmailExists) {
        const encrypted = await encrypt(password);
        const userObj = {
          email,
          password: encrypted,
          firstName,
          lastName,
          phoneNumber,
          bio
        };
        const user = await mongo.addNewUser(userObj);
        res.json("Successfully Registered");
      }
      else {
        res.status(400).json("emmail already exists");
      }
    }
    else {
      console.log("input not good");
    }
  } catch (e) {

  }
}

const onMongoLogin = async (req, res, next) => {
  try {
    const query = { email: req.body.email };
    const matchedUser = await mongo.findUserByEmail(req.body.email);
    const decrypted = await decrypt(req.body.password, matchedUser.password);
    if (decrypted) {
      const token = createToken(req.body.email);
      res.json({ token, matchedUser });
    }
    else {
      res.json("wrong email or password");
    }
  } catch (e) {

  }



}

const getMongoUserById = async (req, res, next) => {
  try {
    const authorized = isAuth(req, res, next);
    if (authorized) {
      const item = await mongo.findUserById(req.params.id);
      res.json(item);
    }
    else {
      res.status(400).send("Not authorized");
    }
  } catch (e) {

  }

}

const getAllMongoUsers = async (req, res, next) => {
  try {
    const authorized = isAuth(req, res, next);
    if(authorized){
      const allUsers = await mongo.getAllUsers();
      res.json(allUsers);
    }
  } catch (e) {

  }

}

const updateUserById = async (req, res, next) => {
  try{
    const updateObj = req.body;
    const { id } = req.params;
    const updatedUser = await mongo.updateUser(id, updateObj);
    res.json(updatedUser);
  } catch(e){

  }

}

const getFullUser = async (req, res, next) => {
  try{
    const { id } = req.params;
    const fullUser = await mongo.getFullUser(id);
    res.json(fullUser);
  } catch(e){
    
  }

}








module.exports = { addNewMongoUser, onMongoLogin, getMongoUserById, getAllMongoUsers, updateUserById, getFullUser };