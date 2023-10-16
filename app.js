let express = require('express');

let app = express();

const cors = require('cors');

let mongoose = require('mongoose');

require('dotenv').config();

app.use(express.json({limit: '50mb'}));

app.use(cors());

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

let mongoURI = process.env.DB;

mongoose.connect(mongoURI);

let port = 5000;

let BrandUsersController = require('./Controllers/BrandUsersController');

app.use('/',BrandUsersController);

let CampaignsController = require('./Controllers/CampaignsController');

app.use('/',CampaignsController);

app.listen(port, ()=>{
    console.log(`Connected on port ${port}`);
})