let express = require('express');

let app = express();

const cors = require('cors');

let mongoose = require('mongoose');

require('dotenv').config();

app.use(express.json({limit: '100mb'}));

app.use(cors());

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

let mongoURI = process.env.DB;

mongoose.connect(mongoURI);

let port = 5000;

let CompanyController = require('./Controllers/CompanyController');
app.use('/', CompanyController);

let CampaignsController = require('./Controllers/CampaignsController');
app.use('/',CampaignsController);

let CreatorProfileController = require('./Controllers/CreatorProfileController')
app.use('/', CreatorProfileController)

let SocialController = require('./Controllers/SocialsControllers');
app.use('/', SocialController);

let AdminController = require('./Controllers/AdminUsersController');
app.use('/', AdminController);

let CreatorApplicationsController = require('./Controllers/CreatorApplicationsController');
app.use('/', CreatorApplicationsController);

let BrandsController = require('./Controllers/BrandsController');
app.use('/', BrandsController);

app.listen(port, ()=>{
    console.log(`Connected on port ${port}`);
})