let mongoose = require('mongoose');

let BrandsSchema = mongoose.Schema({
    company_id: String,
    brand_name: String,
    brand_logo: String
})

let BrandsModel = mongoose.model('brands', BrandsSchema);

module.exports = BrandsModel;