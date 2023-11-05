let mongoose = require('mongoose');

let AdminUserSchema = mongoose.Schema({
    email: String,
    password: String
})

let AdminUserModel = mongoose.model('admin_users', AdminUserSchema);

module.exports = AdminUserModel;