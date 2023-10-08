let express = require('express');

let app = express();

const cors = require('cors');

let mongoose = require('mongoose');

require('dotenv').config();

app.use(express.json());

app.use(cors());

let mongoURI = process.env.DB;

mongoose.connect(mongoURI);

let port = 5000;

let BrandUsersController = require('./Controllers/BrandUsersController');

app.use('/',BrandUsersController);

app.listen(port, ()=>{
    console.log(`Connected on port ${port}`);
})