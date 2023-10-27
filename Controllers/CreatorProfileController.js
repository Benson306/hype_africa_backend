let express = require('express');

let app = express.Router();

let bodyParser = require('body-parser');

const CreatorProfileModel = require('../Models/CreatorsProfileModel');

let urlEncoded = bodyParser.urlencoded({ extended: false  });

const bcrypt = require('bcrypt');

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
                        password: hash,
                        isComplete: false
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
                        industryCount: data.industries.length
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
            res.json("success");
        }else{
            res.json("failed");
        }
    })
})

module.exports = app;