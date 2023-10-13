let mongoose = require('mongoose');

let CampainsSchema = mongoose.Schema({ }, { strict: false})

let CampaignsModel = mongoose.model('campaigns', CampainsSchema);

module.exports = CampaignsModel;