const express = require('express');
const cors = require('cors');
const multer = require("multer");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const petsRouter = require("./routes/petsRouter");
const usersRouter = require("./routes/usersRouter");
const app = express();
const port = 5000;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api/pets', petsRouter);
app.use('/api', usersRouter);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});