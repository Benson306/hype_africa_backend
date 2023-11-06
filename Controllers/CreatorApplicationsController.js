let express = require('express');
const CreatorProfileModel = require('../Models/CreatorsProfileModel');
const ContentCreatorsMediaModel = require('../Models/ContentCreatorsMedia');

let app = express.Router();

let bodyParser = require('body-parser');

let urlEncoded = bodyParser.urlencoded({ extended: false});

app.get('/content_creator_applicants', (req, res)=>{

    CreatorProfileModel.find({$and : [{ creatorType : 'content'}, {isComplete: true}]})
    .then(data => {
        if (data) {
            let completeData = [];

            data.map( item => {
                let newItem = { };

                newItem._id = item._id;
                newItem.firstName = item.firstName;
                newItem.lastName = item.lastName;
                newItem.countryCode = item.countryCode;
                newItem.phoneNumber = item.phoneNumber;
                newItem.industries = item.industries;

                if(item.isApproved == "0"){
                    completeData.push(newItem);
                }

            })

            let newCompleteData = [];

            completeData.map( data => {
                ContentCreatorsMediaModel.findOne({ creator_id: data._id})
                .then(response => {
                    if(response){
                        let media = response.media;

                        let newData = {...data, media };

                        newCompleteData.push(newData);
                    }
                })
                .then(()=>{
                    res.status(200).json(newCompleteData);
                })
            })

          } else {
            res.status(404).json("Not Found");
          }
    })
    .catch(err => {
        res.status(500).json('failed');
    })
})



app.post('/approve/content/:id', urlEncoded, (req, res)=>{

    CreatorProfileModel.findOneAndUpdate({_id: req.params.id}, { isApproved: req.body.value}, { new: true})
    .then(()=>{
        res.status(200).json('success');
    })
    .catch(err => {
        res.status(500).json('failed');
    })
})


app.post('/get_creators', urlEncoded, (req, res)=>{

    CreatorProfileModel.find({ isApproved : req.body.value})
    .then(data => {
        if (data) {
            let completeData = [];

            data.map( item => {
                let newItem = { };

                newItem._id = item._id;
                newItem.email = item.email;
                newItem.firstName = item.firstName;
                newItem.lastName = item.lastName;
                newItem.countryCode = item.countryCode;
                newItem.phoneNumber = item.phoneNumber;
                newItem.industries = item.industries;
                newItem.creatorType = item.creatorType;

                completeData.push(newItem);
                

            })

            res.json(completeData);

          } else {
            res.status(404).json("Not Found");
          }
    })
    .catch(err => {
        res.status(500).json('failed');
    })
})


module.exports = app;