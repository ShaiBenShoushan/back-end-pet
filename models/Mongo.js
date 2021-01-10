const { MongoClient, ObjectID } = require("mongodb");
class Mongo {
    constructor() {
        const url = "mongodb+srv://nigga:dawg@cluster0.q9snw.mongodb.net/<dbname>?retryWrites=true&w=majority";
        this.client = new MongoClient(url, { useUnifiedTopology: true });
        this.dbName = "fullstack_project";
        this.db = null;
        this.petsCollection = null;
        this.usersCollection = null;
        this.init();
    }
    async init() {
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            this.usersCollection = this.db.collection("users");
            this.petsCollection = this.db.collection("pets");
        } catch (err) {
            console.log(err);
        }

    }

    async findUserByEmail(email) {
        try {
            const item = await this.usersCollection.findOne({ email });
            return item;
        } catch (e) {
            console.log(e);
        }
    }
    async findUserById(userId) {
        try {
            const item = await this.usersCollection.findOne({ _id: ObjectID(userId) });

            return item;
        } catch (e) {
            console.log(e);
        }
    }

    async getAllUsers() {
        try {
            const users_collection = this.db.collection("users");
            const all = await users_collection.find().toArray();

            return all;
        } catch (e) {

        }

    }

    async addNewUser(userToAdd) {
        try {
            const newUserDB = await this.usersCollection.insertOne(userToAdd);
            return newUserDB;
        } catch (e) {

        }
    }

    async findOwnedIds(userId) {
        try {
            const pets = await this.petsCollection.find({ owner_id: ObjectID(userId) }).toArray();
            return pets;
        } catch (e) {

        }
    }

    async findSavedIds(userId) {
        try {
            const pets = await this.petsCollection.find({ savedBy: ObjectID(userId) }).toArray();
            return pets;
        } catch (e) {

        }
    }

    async deleteSavedPet(userId, petId) {
        try {
            const filter = { _id: ObjectID(petId) };
            const update = { $pull: { savedBy: ObjectID(userId) } };
            const updated = await this.petsCollection.updateOne(filter, update);
            const updatedToSend = await this.petsCollection.findOne({
                _id: ObjectID(petId)
            });
            return updatedToSend;
        } catch (e) {

        }
    }
    async addSavedPet(userId, petId) {
        try {
            const filter = { _id: ObjectID(petId) };
            const update = { $push: { savedBy: ObjectID(userId) } };
            const updated = await this.petsCollection.updateOne(filter, update);
            const updatedToSend = await this.petsCollection.findOne({
                _id: ObjectID(petId)
            })
            return updatedToSend;
        } catch (e) {

        }
    }
    async returnPetToCenter(userId, petId) {
        try {

            const filter = { _id: ObjectID(petId) };
            const update = { $unset: { owner_id: ObjectID(userId) }, $set: { adoptionStatus: "Center" } };
            const updated = await this.petsCollection.updateOne(filter, update);
            const updatedToSend = await this.petsCollection.findOne({
                _id: ObjectID(petId)
            })
            return updatedToSend;
        } catch (e) {

        }
    }
    async adoptOrFoster(userId, petId, adoptOrFoster) {
        try {
            const filter = { _id: ObjectID(petId) };
            const update = { $set: { owner_id: ObjectID(userId), adoptionStatus: adoptOrFoster } };
            const updated = await this.petsCollection.updateOne(filter, update);
            const updatedToSend = await this.petsCollection.findOne({
                _id: ObjectID(petId)
            })

            return updatedToSend;
        } catch (e) {

        }
    }
    async deletePet(petId) {
        try {
            const deleted = await this.petsCollection.deleteOne({
                _id: ObjectID(petId)
            });

            return deleted;
        } catch (e) {

        }
    }
    async findById(collection, id) {
        try {
            const myCollection = this.db.collection(collection);
            const item = await myCollection.findOne({
                _id: ObjectID(id)
            });
            return item;
        } catch (e) {

        }
    }
    async updatePetById(id, updateObj) {
        try {
            const filter = { _id: ObjectID(id) };
            const update = { $set: updateObj };
            const updated = await this.petsCollection.updateOne(filter, update);
            const updatedToSend = await this.petsCollection.findOne({
                _id: ObjectID(id)
            })
            return updatedToSend;
        } catch (e) {

        }
    }
    async updateUser(id, updateObj) {
        try {
            const filter = { _id: ObjectID(id) };
            const update = { $set: updateObj };
            const updated = await this.usersCollection.updateOne(filter, update);
            const updatedToSend = await this.usersCollection.findOne({
                _id: ObjectID(id)
            })
            return updatedToSend;
        } catch (e) {

        }

    }
    async getFullUser(id) {
        try {
            const item = await this.usersCollection.findOne({
                _id: ObjectID(id)
            });
            const savedPets = await this.petsCollection.find({ savedBy: ObjectID(id) }).toArray();
            const ownedPets = await this.petsCollection.find({ owner_id: ObjectID(id) }).toArray();
            const objToReturn = { item, savedPets, ownedPets };
            return objToReturn;
        } catch (e) {

        }
    }
    async checkIfEmailExists(email) {
        try {
            const item = await this.usersCollection.find({ email }).count();
            return item;
        } catch (e) {

        }
    }
    async getPetDocuments(userId, owned = false) {
        try {
            let query = {};
            if (userId && owned) query = { owner_id: ObjectID(userId) };
            else if (userId) query = { savedBy: ObjectID(userId) };
            const documents = await this.petsCollection.find(query).count();
            return documents;
        } catch (e) {

        }
    }
    async getUsersDocuments() {
        try {
            const documents = await this.usersCollection.countDocuments();
            return documents;
        } catch (e) {

        }
    }

    async petSearch(query) {
        try {
            const { search, adopted, height, weight, type, name } = query

            const newQuery = { $or: [{ adoptionStatus: { $in: [adopted, search] } }, { name: { $in: [name, search] } }] };
            console.log(newQuery)

            const pets = await this.petsCollection.find()
                .toArray();
            return pets;
        } catch (e) {

        }
    }
    async getAllPets() {
        try {
            const pets = await this.petsCollection.find().toArray();
            return pets;
        } catch (e) {

        }
    }
    async savedPagination(limit, startIndex, userId) {
        try {

            const results = await this.petsCollection
                .find({ savedBy: ObjectID(userId) })
                .limit(limit)
                .skip(startIndex)
                .toArray();


            return results;
        } catch (e) {

        }
    }
    async ownedPagination(limit, startIndex, userId) {
        try {
            const results = await this.petsCollection
                .find({ owner_id: ObjectID(userId) })
                .limit(limit)
                .skip(startIndex)
                .toArray();


            return results;
        } catch (e) {

        }
    }



    async addNewPet(pet) {
        try {
            const newPet = await this.petsCollection.insertOne(pet);
            return newPet;
        } catch (e) {
        }
    }



}

module.exports = new Mongo();