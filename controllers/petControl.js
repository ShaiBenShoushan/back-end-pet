
const mongo = require("../models/Mongo");

const { cloudMiddleware } = require("../utils/storageConfig");
const { isAuth } = require('../utils/auth');

async function deleteSavedPetByUserId(req, res) {
    try {
        const authorized = isAuth(req, res, next);
        if (authorized) {

            const { id, petId } = req.params;
            const petTodelete = await mongo.deleteSavedPet(id, petId);
            res.json(petTodelete);
        }
    } catch (e) {

    }
}

async function savePetByUserId(req, res) {
    try {
        const authorized = isAuth(req, res, next);
        if (authorized) {

            const { id, petId } = req.params;
            const savedPet = await mongo.addSavedPet(id, petId);
            res.json(savedPet);
        }
    } catch (e) {

    }
}

async function returnPetToCenter(req, res) {
    try {
        const authorized = isAuth(req, res, next);
        if (authorized) {

            const { id, petId } = req.params;
            const returnedPet = await mongo.returnPetToCenter(id, petId);
            res.json(returnedPet);
        }
    } catch (e) {

    }
}

async function adopt(req, res) {
    try {
        const authorized = isAuth(req, res, next);
        if (authorized) {

            const { id, petId } = req.params;
            const adoptedPet = await mongo.adoptOrFoster(id, petId, "Adopted");
            res.json(adoptedPet);
        }
    } catch (e) {

    }
}

async function foster(req, res) {
    try {
        const authorized = isAuth(req, res, next);
        if (authorized) {

            const { id, petId } = req.params;
            const fosteredPet = await mongo.adoptOrFoster(id, petId, "Fostered");
            res.json(fosteredPet);
        }
    } catch (e) {

    }
}

async function getPetByIdMongo(req, res) {
    try {
        // const authorized = isAuth(req, res, next);
        // if (authorized) {

            const { petId } = req.params;
            const pet = await mongo.findById("pets", petId);
            res.json(pet);
        // }
    } catch (e) {

    }
}


async function deletePetByIdMongo(req, res) {
    try {
        const authorized = isAuth(req, res, next);
        if (authorized) {

            const { petId } = req.params;
            const pet = await mongo.deletePet(petId)
            res.json(pet);
        }
    } catch (e) {

    }
}

async function updatePetByIdMongo(req, res) {
    try {
        const authorized = isAuth(req, res, next);
        if (authorized) {

            const objToUpdate = req.body;
            const { id } = req.params;
            const pet = await mongo.updatePetById(id, objToUpdate);
            res.json(pet);
        }
    } catch (e) {

    }

}

async function addNewPetAdmin(req, res, next) {
    try {
        console.log(req.headers);
        const authorized = isAuth(req, res, next);
        if (authorized) {

            const url = await cloudMiddleware(req, res, next);
            const parsed = JSON.parse(req.body.data);
            parsed.pic = url;
            const success = await mongo.addNewPet(parsed);
        }
    } catch (e) {

    }
}


async function petSearch(req, res) {
    try {
        const query = req.query;
        const petResults = await mongo.petSearch(query);
        res.json(petResults);
    } catch (e) {

    }
}

async function getAllPets(req, res) {
    try {
        // console.log(req.headers);
        // const authorized = isAuth(req, res, next);
        // if (authorized) {

            const petResults = await mongo.getAllPets();
            res.json(petResults);
        // }
    } catch (e) {

    }
}




//pagination stuff






async function savedPagination(req, res, next) {
    try {
        const authorized = isAuth(req, res, next);
        if (authorized) {

            const { id } = req.params;
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
    
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
    
            const results = {};
    
            if (endIndex < await mongo.getPetDocuments(id)) {
                results.next = {
                    page: page + 1,
                    limit: limit
                }
            }
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit
                }
            }
            results.results = await mongo.savedPagination(limit, startIndex, id);
            res.json(results);
        }
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

async function ownedPagination(req, res, next) {
    try {
        console.log(req.headers);
        const authorized = isAuth(req, res, next);
        if (authorized) {

            const { id } = req.params;
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
    
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
    
            const results = {};
    
            if (endIndex < await mongo.getPetDocuments(id, true)) {
                results.next = {
                    page: page + 1,
                    limit: limit
                }
            }
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit
                }
            }
            results.results = await mongo.ownedPagination(limit, startIndex, id);
            res.json(results);
        }
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}


async function pagination(req, res, next) {
    try {
        const query = req.query.query;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < await mongo.getPetDocuments()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }


        results.results = await mongo.pagination(limit, startIndex, { adopted: query.adopted });
        res.json(results);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}





module.exports = { deleteSavedPetByUserId, savePetByUserId, returnPetToCenter, petSearch, adopt, foster, getPetByIdMongo, deletePetByIdMongo, updatePetByIdMongo, pagination, addNewPetAdmin, savedPagination, ownedPagination, getAllPets }
