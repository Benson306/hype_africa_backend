let express = require('express');

let app = express.Router();

let bodyParser = require('body-parser');

const multer = require('multer'); // For handling file uploads

const fs = require('fs'); // For working with the file system

const path = require('path'); // For handling file paths
const CampaignsModel = require('../Models/CampaignsModels');

let urlEncoded = bodyParser.urlencoded({ extended: false});

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './uploads');
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })


app.post('/add_influencer_campaign', upload.single('cover'), urlEncoded, (req, res)=>{

    console.log(req.body.id);
    
    let data = {
        status: 'complete',
        user_id: req.body.id,
        title: req.body.title,
        cover: req.file.filename,
        objective: req.body.objective,
        industry: req.body.industry,
        call_to_action: req.body.call_to_action,
        dos: req.body.dos,
        donts: req.body.donts,
        instagramTags: req.body.instagramTags,
        xTags: req.body.xTags,
        fbTags: req.body.fbTags,
        gender: req.body.gender,
        minAge: req.body.minAge,
        maxAge: req.body.maxAge,
        instaFollowers: req.body.instaFollowers,
        xFollowers: req.body.xFollowers,
        fbFollowers: req.body.fbFollowers,
        location: req.body.location,
        budget: req.body.budget,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        numberOfDays: req.body.numberOfDays
    }

    CampaignsModel(data).save()
    .then(()=>{
        res.json('success');
    })

    
})


module.exports = app;