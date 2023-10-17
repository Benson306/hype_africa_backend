let mongoose = require('mongoose');

let CreatorProfileSchema = mongoose.Schema({ 
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phoneNumber: String,
    countryCode: String,
    isComplete: Boolean
})

let CreatorProfileModel = mongoose.model('creator_users', CreatorProfileSchema);

module.exports = CreatorProfileModel;