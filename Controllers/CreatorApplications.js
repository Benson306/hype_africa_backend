let express = require('express');
const CreatorProfileModel = require('../Models/CreatorsProfileModel');
const ContentCreatorsMediaModel = require('../Models/ContentCreatorsMedia');

let app = express.Router();


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
                        console.log(response);
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



app.get('/approve/content/:id', (req, res)=>{
    CreatorProfileModel.findOneAndUpdate({_id: req.params.id}, { isApproved: 1}, { new: true})
    .then(()=>{
        res.status(200).json('success');
    })
    .catch(err => {
        res.status(500).json('failed');
    })
})


module.exports = app;