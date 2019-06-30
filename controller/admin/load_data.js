var mongoose = require('mongoose')
var DBurl = require('./../../data/config')
mongoose.connect(DBurl.url)
var user_load = require('../user/load_page');

var userSchema = require('./../../data/models/user')

// load dữ liệu cho trang index
var load_user = async (req, res, next) => {
    await userSchema.find({ type: { $ne: 'admin' } }, (err, docs) => {
        var userChunks = [];
        var chunkSize = 1;
        for (var i = 0; i < docs.length; i += chunkSize) {
            userChunks.push(docs.slice(i, i + chunkSize));
        }
        var page = parseInt(req.query.page) || 1;
        var perPage = 5;
        var start = (page - 1) * perPage;
        var end = page * perPage;
        var num_page = Math.ceil(docs.length / perPage)
        userChunks = userChunks.slice(start, end)

        res.render('admin/ad_index', { users: userChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
    }).sort({ type: -1, name: -1 })
}

// load dữ liệu cho trang edit user
var load_edit_user = async (req, res, next) => {
    var id_user = req.params.id;
    await userSchema.find({ _id: id_user }, (err, docs) => {
        var userChunks = [];
        var chunkSize = 1;
        for (var i = 0; i < docs.length; i += chunkSize) {
            userChunks.push(docs.slice(i, i + chunkSize));
        }

        res.render('admin/ad_edit_user', { users: userChunks, success: req.flash('success'), message: req.flash('message')});
    })
}

module.exports = {
    load_user,
    load_edit_user
}
