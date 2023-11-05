let express = require('express');

let app = express.Router();

let bodyParser = require('body-parser');
const AdminUserModel = require('../Models/AdminUserModel');

let urlEncoded = bodyParser.urlencoded({ extended: false});

const bcrypt = require('bcrypt');

app.post('/add_admin', urlEncoded, (req, res)=>{

    AdminUserModel.findOne({email: req.body.email})
    .then(data => {
        if(data){
            res.status(500).json('user exists');
        }else{
            bcrypt.hash(req.body.password, Number(process.env.saltRounds), function(err, hash) {
                AdminUserModel({ email: req.body.email, password: hash }).save()
                .then(()=>{
                    res.status(200).json('success');
                })
                .catch(err => {
                    res.status(500).json('failed')
                })
            })
            
        }
    })
})


app.post('/admin_login', urlEncoded, (req, res)=>{

    AdminUserModel.findOne({email: req.body.email})
    .then(data => {
        if(data){
            bcrypt.compare(req.body.password, data.password, function(err, result) {
                if(result === true){
                    let response = {
                        uid: data._id
                    }
                    res.status(200).json(response);
                }else{
                    res.status(500).json({status: 'failed'}); // Password Does Not Match
                }
            })
        }else{
            res.status(500).json('user does not exist');  
        }
    })
})


module.exports = app;