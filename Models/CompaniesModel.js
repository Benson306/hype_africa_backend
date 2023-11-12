let mongoose = require('mongoose');

let CompaniesSchema = mongoose.Schema({
    email: String,
    phoneNumber: String,
    companyName: String,
    logo: String,
    countryCode: String,
    country: String,
    city: String,
    password: String,
    isComplete: Boolean,
    isApproved: Number
})

let CompaniesModel = mongoose.model('companies', CompaniesSchema);

module.exports = CompaniesModel;