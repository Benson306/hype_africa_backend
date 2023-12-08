let express = require('express');

let app = express.Router();

let bodyParser = require('body-parser');
let urlEncoded = bodyParser.urlencoded({ extended: false })

const multer = require('multer'); // For handling file uploads

const fs = require('fs'); // For working with the file system

const path = require('path'); // For handling file paths
const BrandsModel = require('../Models/BrandsModel');
const CompaniesModel = require('../Models/CompaniesModel');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './uploads');
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

app.post('/add_brand', upload.single('image'), urlEncoded, (req, res)=>{
    
    let company_id = req.body.company_id;
    let brand_name = req.body.brandName;
    let brand_logo = req.file.filename;

    let data = {
        company_id,
        brand_logo,
        brand_name
    }

    BrandsModel(data).save()
    .then(()=>{
        CompaniesModel.findOneAndUpdate({_id: company_id}, { isComplete: true},{ new: true})
        .then((data)=>{
            res.json({status: 'success', isApproved: 0})
        })
    })
})

app.get('/all_brands/:company_id', urlEncoded, (req, res)=>{
    BrandsModel.find({ company_id: req.params.company_id})
    .then((data)=>{
        res.json(data);
    })
    .catch(err => {
        res.status(500).json('failed');
    })
})

app.get('/all_brands', urlEncoded, (req, res)=>{
    BrandsModel.find({})
    .then((data)=>{
        res.json(data);
    })
    .catch(err => {
        res.status(500).json('failed');
    })
})


module.exports = app;