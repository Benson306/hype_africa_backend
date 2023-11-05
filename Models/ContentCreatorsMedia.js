let mongoose = require('mongoose');

let ContentCreatorsMediaSchema = mongoose.Schema({ 
    creator_id: String,
    media: [String],
})

let ContentCreatorsMediaModel = mongoose.model('content_creator_media', ContentCreatorsMediaSchema);

module.exports = ContentCreatorsMediaModel;