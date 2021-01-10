const express = require('express');
const router = express.Router();
const { addNewMongoUser, onMongoLogin, getMongoUserById, getAllMongoUsers, updateUserById, getFullUser } = require("../controllers/userControl");
router.get("/:id", getMongoUserById);
router.post("/signup", addNewMongoUser);
router.post("/login", onMongoLogin);
router.put("/:id", updateUserById);
router.get("/:id/full", getFullUser);
router.get("/", getAllMongoUsers);

module.exports = router;
