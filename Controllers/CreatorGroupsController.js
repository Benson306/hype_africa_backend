let express = require('express');

let app = express.Router();

let bodyParser = require('body-parser');
const CreatorGroupsModel = require('../Models/CreatorGroupsModel');
let urlEncoded = bodyParser.urlencoded({ extended: false })

app.post('/creator_groups', urlEncoded, (req, res)=>{
    let data = req.body;
    CreatorGroupsModel.find({ $and : [{ brand_id : data.brand_id}, { groupName: data.groupName }]})
    .then(response => {
        if(response.length > 0){
            res.status(400).json('Group Name already exists')
        }else{
            CreatorGroupsModel(data).save()
            .then(()=>{
                res.status(200).json('success');
            })
            .catch(()=>{
                res.status(500).json('failed');
            })
        }
    })
    .catch(()=>{
        res.status(500).json('failed');
    })

    
})

app.get('/creator_groups/:id', urlEncoded, (req, res)=>{
    CreatorGroupsModel.find({brand_id: req.params.id})
    .then(data => {
        res.status(200).json(data);
    })
    .catch(err => {
        req.status(404).json('failed');
    })
})

app.put('/creator_groups/:id', urlEncoded, (req, res)=>{
    CreatorGroupsModel.findByIdAndUpdate(req.params.id, {groupName: req.body.groupName, selectedCreators: req.body.selectedCreators}, { new: true})
    .then(data => {
        res.status(200).json('success');
    })
    .catch(err => {
        req.status(404).json('failed');
    })
})

app.delete('/creator_groups/:id', urlEncoded, (req, res)=>{
    CreatorGroupsModel.findByIdAndRemove(req.params.id)
    .then(data => {
        res.status(200).json('success');
    })
    .catch(err => {
        req.status(404).json('failed');
    })
})


module.exports = app;