const multer = require("multer");
const path = require("path");


const cloudinary = require("cloudinary").v2;

const { cloudinaryKeys } = require("../config");

console.log(cloudinaryKeys);
cloudinary.config(cloudinaryKeys);

const DatauriParser = require("datauri/parser");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const parser = new DatauriParser();

const cloudMiddleware = async (req, res, next) => {
    parser.format(
        path.extname(req.file.originalname).toString(),
        req.file.buffer
    );
    const results = await cloudinary.uploader.upload(parser.content);
    return results.secure_url;
}

module.exports =  {cloudMiddleware, upload};
