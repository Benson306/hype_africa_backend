let express = require('express');

let app = express.Router();

let bodyParser = require('body-parser');

const multer = require('multer'); // For handling file uploads

const fs = require('fs'); // For working with the file system

const path = require('path'); // For handling file paths

const bcrypt = require('bcrypt');

const BrandUsersModel = require('../Models/BrandUsersModel');
const BrandProfileModel = require('../Models/BrandProfileModel');

let urlEncoded = bodyParser.urlencoded({ extended: false});

app.post('/brand_signup', urlEncoded, (req, res)=>{
    let email = req.body.email;
    let password = req.body.password;
    let phoneNumber = req.body.phoneNumber;

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const passwordPattern = /^(?=.*\d).{6,}$/;

    const phonePattern = /^\d{9}$/;

    if(emailPattern.test(email) && passwordPattern.test(password) && phonePattern.test(phoneNumber)){

        BrandUsersModel.find({ email: email})
        .then(data =>{
            if(data.length >  0){
                res.json('Email Has Been Used');
            }else{
                bcrypt.hash(password, Number(process.env.saltRounds), function(err, hash) {
                    let data = {
                        email,
                        phoneNumber,
                        companyName: req.body.companyName,
                        countryCode: req.body.countryCode,
                        country: req.body.country,
                        city: req.body.city,
                        password: hash,
                        isComplete: false
                    }
        
                    BrandUsersModel(data).save()
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

app.post('/brand_login', urlEncoded, (req,res)=>{
    let email = req.body.email;
    let password = req.body.password;

    BrandUsersModel.findOne({ email : email})
    .then(data =>{
        if(data){
            bcrypt.compare(password, data.password, function(err, result) {
                if(result === true){
                    let response = {
                        status: 'success',
                        uid: data._id,
                        isComplete: data.isComplete,
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

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './uploads');
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

app.post('/complete_profile', upload.single('image'), urlEncoded, (req, res)=>{
    let brand_logo = req.file.filename;
    let user_id = req.body.user_id;
    let brand_name = req.body.brandName;
    let about = req.body.about;

    let data = {
        user_id,
        brand_logo,
        brand_name,
        about
    }

    BrandProfileModel(data).save()
    .then(()=>{
        BrandUsersModel.findOneAndUpdate({_id: user_id}, { isComplete: true},{ new: true})
        .then(()=>{
            res.json({status: 'success'})
        })
    })
})


app.get('/profile/:id', urlEncoded, (req, res)=>{
    let uid = req.params.id;

    let response = { };

    BrandUsersModel.findOne({ _id: uid})
    .then((data)=>{
        if(data){
            response.email = data.email;
            response.phoneNumber = data.phoneNumber;
            response.companyName = data.companyName;
            response.country = data.country;
            response.city = data.city;
            response.countryCode = data.countryCode;

            BrandProfileModel.findOne({ user_id : uid})
            .then((profile)=>{
                if(profile){
                    response.brand_name = profile.brand_name;
                    response.about = profile.about;
                    response.brand_logo = profile.brand_logo;

                    res.json(response);
                }
            })

        }
    })

})

app.put('/profileWithImage/:id', upload.single('image'), urlEncoded, (req, res)=>{
    let brand_logo = req.file.filename;
    let user_id = req.body.user_id;
    let brand_name = req.body.brand_name;
    let about = req.body.about;
    let email = req.body.email;
    let phoneNumber = req.body.phoneNumber;
    let companyName = req.body.companyName;
    let countryCode = req.body.countryCode;
    let country = req.body.country;
    let city = req.body.city;

    BrandUsersModel.findOneAndUpdate({_id: user_id}, { email: email, phoneNumber: phoneNumber, companyName: companyName, country: country, city: city, countryCode: countryCode },{new: true})
    .then(()=>{
        BrandProfileModel.findOneAndUpdate({user_id: user_id},{brand_name: brand_name, about: about, brand_logo: brand_logo},{new: true})
        .then(()=>{
            res.json('success')
        })
    })
})

app.put('/profileWithoutImage/:id', urlEncoded, (req, res)=>{
    let user_id = req.body.user_id;
    let brand_name = req.body.brand_name;
    let about = req.body.about;
    let email = req.body.email;
    let phoneNumber = req.body.phoneNumber;
    let companyName = req.body.companyName;
    let countryCode = req.body.countryCode;
    let country = req.body.country;
    let city = req.body.city;

    BrandUsersModel.findOneAndUpdate({_id: user_id}, { email: email, phoneNumber: phoneNumber, companyName: companyName, country: country, city: city, countryCode: countryCode },{new: true})
    .then(()=>{
        BrandProfileModel.findOneAndUpdate({user_id: user_id},{brand_name: brand_name, about: about},{new: true})
        .then(()=>{
            res.json('success')
        })
    })

})


app.put('/change_password/:id', urlEncoded, (req, res)=>{
    let id = req.params.id;

    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    BrandUsersModel.findOne({_id: id})
    .then(data => {
        console.log(data)
        if(data){
            bcrypt.compare(oldPassword, data.password, function(err, result) {
                if(result === true){
                    bcrypt.hash(newPassword, Number(process.env.saltRounds), function(err, hash) {
                        BrandUsersModel.findOneAndUpdate({_id: id}, { password: hash}, { new : true})
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

module.exports = app;