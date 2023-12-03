let mongoose = require('mongoose');

let CreatorGroupsSchema = mongoose.Schema({
    brand_id: String,
    groupName: String,
    selectedCreators: [String]
})

let CreatorGroupsModel = mongoose.model('creator_groups', CreatorGroupsSchema);

module.exports = CreatorGroupsModel;