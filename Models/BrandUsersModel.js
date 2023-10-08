let mongoose = require('mongoose');

let BrandUsersSchema = mongoose.Schema({
    email: String,
    phoneNumber: String,
    companyName: String,
    country: String,
    city: String,
    password: String,
    isComplete: Boolean
})

let BrandUsersModel = mongoose.model('brand_users', BrandUsersSchema);

module.exports = BrandUsersModel;