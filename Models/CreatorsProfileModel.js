let mongoose = require('mongoose');

let CreatorProfileSchema = mongoose.Schema({ 
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phoneNumber: String,
    countryCode: String,
    industries: [String],
    averageEarning: Number,
    creatorType: String,
    isComplete: Boolean,
    isApproved: Number,
    instagramUserId: String,
    instagramUserName: String
})

let CreatorProfileModel = mongoose.model('creator_users', CreatorProfileSchema);

module.exports = CreatorProfileModel;