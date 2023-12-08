let express = require('express');

let app = express.Router();

let bodyParser = require('body-parser');

const multer = require('multer'); // For handling file uploads

const fs = require('fs'); // For working with the file system

const path = require('path'); // For handling file paths

const CampaignsModel = require('../Models/CampaignsModels');

let urlEncoded = bodyParser.urlencoded({extended: false});

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

    let data = {
        status: req.body.status,
        type: "influencer",
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
        numberOfDays: req.body.numberOfDays,
        brand_id: req.body.brand_id,
        allPartcipants: req.body.allParticipants,
        creatorGroupsSelected: req.body.creatorGroupsSelected
    }

    CampaignsModel(data).save()
    .then(()=>{
        res.json('success');
    })

    
})

app.post('/add_influencer_draft_with_image', upload.single('cover'), urlEncoded, (req, res)=>{

    // console.log(req.body)
    let data = {
        status: 'draft',
        type: "influencer",
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
        numberOfDays: req.body.numberOfDays,
        brand_id: req.body.brand_id,
        allPartcipants: req.body.allParticipants,
        creatorGroupsSelected: req.body.creatorGroupsSelected
    }

    CampaignsModel(data).save()
    .then(()=>{
        res.json('success');
    })

    
})


app.post('/add_influencer_draft_without_image', urlEncoded, (req, res)=>{

    let data = {
        status: 'draft',
        type: "influencer",
        user_id: req.body.id,
        title: req.body.title,
        cover: "null",
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
        numberOfDays: req.body.numberOfDays,
        brand_id: req.body.brand_id,
        allPartcipants: req.body.allParticipants,
        creatorGroupsSelected: req.body.creatorGroupsSelected
    }

    CampaignsModel(data).save()
    .then(()=>{
        res.json('success');
    })

    
})


app.get('/get_campaigns/:brand_id/:type', urlEncoded, (req, res)=>{

    if(req.params.type == "all"){
        CampaignsModel.find({ brand_id: req.params.brand_id })
        .then((data)=>{
            res.json(data);
        })
    }else{
        CampaignsModel.find({ $and: [ {brand_id: req.params.brand_id}, {status: req.params.type}] })
        .then((data)=>{
            res.json(data);
        })
    }
    
})

app.get('/get_all_campaigns', urlEncoded, (req, res)=>{
    CampaignsModel.find({})
    .then(response => res.json(response))
    .catch(err => res.json(err));
})

app.get('/get_campaigns/:type', urlEncoded, (req, res)=>{

    if(req.params.type == "all"){
        CampaignsModel.find()
        .then((data)=>{
            res.json(data);
        })
    }else{
        CampaignsModel.find({status: req.params.type})
        .then((data)=>{
            res.json(data);
        })
    }
    
})

app.get('/get_campaign/:id', urlEncoded, (req, res)=>{

    CampaignsModel.findOne({_id: req.params.id})
    .then((data)=>{
        res.json(data);
    })
    
})

app.delete('/del_campaign/:user_id/:campaign_id', urlEncoded, (req, res)=>{
    let user_id = req.params.user_id;
    let campaign_id = req.params.campaign_id;

    CampaignsModel.findOneAndDelete({ $and: [ {user_id: user_id}, {_id: campaign_id}] })
    .then(()=>{
        res.json('success');
    })
})


module.exports = app;