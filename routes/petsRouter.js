const express = require('express');
const router = express.Router();
router.use(express.json());
const { upload } = require("../utils/storageConfig");
const { deleteSavedPetByUserId, savePetByUserId, returnPetToCenter, petSearch, adopt, foster, getPetByIdMongo, deletePetByIdMongo, updatePetByIdMongo, pagination, addNewPetAdmin, savedPagination, ownedPagination, getAllPets } = require("../controllers/petControl");
router.get("/allPets", getAllPets);
router.get("/:petId", getPetByIdMongo);
router.delete("/:petId", deletePetByIdMongo);
router.get("/", petSearch);
router.post("/:id/:petId/adopt", adopt);
router.post("/:id/:petId/foster", foster);
router.put("/:id/:petId/return", returnPetToCenter);
router.post("/:id/:petId/save", savePetByUserId);
router.delete("/:id/:petId/deleteSave", deleteSavedPetByUserId);
router.get("/userOwned/:id", ownedPagination);
router.get("/userSaved/:id", savedPagination);
router.put("/:id", updatePetByIdMongo);
router.post('/adminNewPetPic', upload.single('picture'), addNewPetAdmin);


module.exports = router;