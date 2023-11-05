let express = require('express');

let app = express.Router();

let bodyParser = require('body-parser');

const CreatorProfileModel = require('../Models/CreatorsProfileModel');

let urlEncoded = bodyParser.urlencoded({ extended: false  });

const bcrypt = require('bcrypt');

const multer = require('multer'); // For handling file uploads

const fs = require('fs'); // For working with the file system

const path = require('path'); // For handling file paths
const ContentCreatorsMediaModel = require('../Models/ContentCreatorsMedia');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './uploads');
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

app.post('/create_creator_profile', urlEncoded, (req, res)=>{

    let email = req.body.email;
    let password = req.body.password;
    let phoneNumber = req.body.phoneNumber;

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const passwordPattern = /^(?=.*\d).{6,}$/;

    const phonePattern = /^\d{9}$/;

    if(emailPattern.test(email) && passwordPattern.test(password) && phonePattern.test(phoneNumber)){
        CreatorProfileModel.findOne({email: req.body.email})
        .then((data)=>{
            if(data){
                res.json("user exists")
            }else{
                bcrypt.hash(password, Number(process.env.saltRounds), function(err, hash) {
                    let data = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email,
                        phoneNumber,
                        countryCode: req.body.countryCode,
                        creatorType: req.body.creatorType,
                        password: hash,
                        isComplete: false,
                        isApproved: 0
                    }

                    CreatorProfileModel(data).save()
                    .then(()=>{
                        res.json('success')
                    })
                })
            }
        
        })
    }else{
        res.json('failed')
    }

    
} )

app.post('/creator_login', urlEncoded, (req, res)=>{
    CreatorProfileModel.findOne({ email : req.body.email})
    .then(data => {
        if(data){
            bcrypt.compare(req.body.password, data.password, function(err, result) {
                if(result === true){
                    let response = {
                        status: 'success',
                        uid: data._id,
                        isComplete: data.isComplete,
                        industryCount: data.industries.length,
                        creatorType: data.creatorType,
                        isApproved: Number(data.isApproved)
                    }
                    res.json(response);
                }else{
                    res.json({status: 'failed'}); // Password Does Not Match
                }
            })
        }else{
            res.json({ status: 'failed' })
        }
    })
})

app.post('/update_industries', urlEncoded, (req, res)=>{
    CreatorProfileModel.findOneAndUpdate({ _id: req.body.id}, { industries: req.body.industries}, { new: true})
    .then(data => {
        if(data){
            res.json({ creatorType: data.creatorType, status : "success"});
        }else{
            res.json("failed");
        }
    })
})

app.post('/upload_content_creator_media', urlEncoded, upload.any(), (req, res)=>{

    let file1 = req.files[0].filename;
    let file2 = req.files[1].filename;
    let file3 = req.files[2].filename;
    let file4 = req.files[3].filename;
    let id = req.body.id;

    ContentCreatorsMediaModel({
        creator_id: id,
        media: [ file1, file2, file3, file4]
    }).save()
    .then((data)=>{
        CreatorProfileModel.findOneAndUpdate({_id: id}, { isComplete: true}, { new: true})
        .then(()=>{
            res.status(200).json('success');
        })
        .catch(err => {
            res.status(500).json('failed');
        })
    })
    .catch(err => {
        res.status(500).json('failed');
    })
})

module.exports = app;