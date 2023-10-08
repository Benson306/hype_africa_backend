let mongoose = require('mongoose');

let BrandProfileSchema = mongoose.Schema({
    user_id: String,
    brand_name: String,
    about: String,
    brand_logo: String
})

let BrandProfileModel = mongoose.model('brand_users_profile', BrandProfileSchema);

module.exports = BrandProfileModel;