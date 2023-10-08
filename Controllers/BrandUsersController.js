let express = require('express');

let app = express.Router();

let bodyParser = require('body-parser');

const bcrypt = require('bcrypt');
const BrandUsersModel = require('../Models/BrandUsersModel');

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

module.exports = app;