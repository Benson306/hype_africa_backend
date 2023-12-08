let express = require('express');

let app = express.Router();

let bodyParser = require('body-parser');

const multer = require('multer'); // For handling file uploads

const fs = require('fs'); // For working with the file system

const path = require('path'); // For handling file paths

const bcrypt = require('bcrypt');

const CompaniesModel = require('../Models/CompaniesModel');

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

app.post('/company_signup', urlEncoded, upload.single('image') ,(req, res)=>{
    let email = req.body.email;
    let password = req.body.password;
    let phoneNumber = req.body.phoneNumber;
    let logo = req.file.filename;

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const passwordPattern = /^(?=.*\d).{6,}$/;

    const phonePattern = /^\d{9}$/;

    if(emailPattern.test(email) && passwordPattern.test(password) && phonePattern.test(phoneNumber)){

        CompaniesModel.find({ email: email})
        .then(data =>{
            if(data.length >  0){
                res.json('Email Has Been Used');
            }else{
                bcrypt.hash(password, Number(process.env.saltRounds), function(err, hash) {
                    let data = {
                        email,
                        phoneNumber,
                        companyName: req.body.companyName,
                        logo,
                        countryCode: req.body.countryCode,
                        country: req.body.country,
                        city: req.body.city,
                        password: hash,
                        isComplete: false,
                        isApproved: 0
                    }
        
                    CompaniesModel(data).save()
                    .then(data => {
                        res.json("success");
                    })
                    .catch((err)=>{
                        res.json("Failed");
                    })
                });
            }
        })

        
    }else{
        res.json('Failed');
    }


} )

app.post('/company_login', urlEncoded, (req,res)=>{
    let email = req.body.email;
    let password = req.body.password;

    CompaniesModel.findOne({ email : email})
    .then(data =>{
        if(data){
            bcrypt.compare(password, data.password, function(err, result) {
                if(result === true){
                    let response = {
                        status: 'success',
                        uid: data._id,
                        isComplete: data.isComplete,
                        isApproved: data.isApproved
                    }
                    res.json(response);
                }else{
                    res.json('Failed'); // Password Does Not Match
                }
            });
        }else{
            res.json("Failed"); //User Does Not Exist
        }
    })
})

app.get('/companies', (req, res)=>{
    CompaniesModel.find({})
    .then((data)=>{
        res.json(data)
    })
})


app.get('/company_profile/:id', urlEncoded, (req, res)=>{
    let uid = req.params.id;

    let response = { };

    CompaniesModel.findOne({ _id: uid})
    .then((data)=>{
        if(data){
            response.email = data.email;
            response.phoneNumber = data.phoneNumber;
            response.companyName = data.companyName;
            response.country = data.country;
            response.city = data.city;
            response.countryCode = data.countryCode;
            response.logo = data.logo;

            res.json(response);
        }
    })

})

app.put('/updateProfileWithImage/:id', upload.single('image'), urlEncoded, (req, res)=>{
    let logo = req.file.filename;
    let company_id = req.body.company_id;
    let email = req.body.email;
    let phoneNumber = req.body.phoneNumber;
    let companyName = req.body.companyName;
    let countryCode = req.body.countryCode;
    let country = req.body.country;
    let city = req.body.city;

    CompaniesModel.findOneAndUpdate({_id: company_id}, { email: email, phoneNumber: phoneNumber, companyName: companyName, country: country, city: city, countryCode: countryCode, logo:  logo},{new: true})
    .then(()=>{
        res.json('success')
    })
})

app.put('/updateProfileWithoutImage/:id', urlEncoded, (req, res)=>{
    let company_id = req.body.company_id;
    let email = req.body.email;
    let phoneNumber = req.body.phoneNumber;
    let companyName = req.body.companyName;
    let countryCode = req.body.countryCode;
    let country = req.body.country;
    let city = req.body.city;

    CompaniesModel.findOneAndUpdate({_id: company_id}, { email: email, phoneNumber: phoneNumber, companyName: companyName, country: country, city: city, countryCode: countryCode },{new: true})
    .then(()=>{
        res.json('success')
    })

})


app.put('/change_password/:company_id', urlEncoded, (req, res)=>{
    let company_id = req.params.company_id;

    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    CompaniesModel.findOne({_id: company_id})
    .then(data => {
        if(data){
            bcrypt.compare(oldPassword, data.password, function(err, result) {
                if(result === true){
                    bcrypt.hash(newPassword, Number(process.env.saltRounds), function(err, hash) {
                        CompaniesModel.findOneAndUpdate({_id: company_id}, { password: hash}, { new : true})
                        .then(()=>{
                            res.json("success");
                        })
                    })
                    
                }else{
                    res.json('failed'); // Password Does Not Match
                }
            })
        }else{
            res.json('failed')
        }
    })
})

app.get('/approve_company/:id/:value', urlEncoded, (req, res)=>{
    CompaniesModel.findOneAndUpdate({_id: req.params.id}, { isApproved: req.params.value }, {new: true})
    .then(()=>{
        res.status(200).json("success");
    })
    .catch(()=>{
        res.status(400).json("failed");
    })
})

module.exports = app;