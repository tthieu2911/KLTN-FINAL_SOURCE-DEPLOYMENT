var contractSchema = require('../../data/models/contract')
var userSchema = require('../../data/models/user')
var user_load = require('../user/load_page');

//load đơn hàng đang cần giao
var load_contract = async (req, res, next) => {
    await contractSchema.find({ 'status': "3" }, (err, docs) => {
        var contractChunks = [];
        var chunkSize = 1;
        for (var i = 0; i < docs.length; i += chunkSize) {
            contractChunks.push(docs.slice(i, i + chunkSize));
        }
        var page = parseInt(req.query.page) || 1;
        var perPage = 5;
        var start = (page - 1) * perPage;
        var end = page * perPage;
        var num_page = Math.ceil(docs.length / perPage)
        contractChunks = contractChunks.slice(start, end)

        res.render('shipper/sp_index', { contracts: contractChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
    }).sort({ status: -1 }).populate('product_id buyer_id seller_id')
}

//load chi tiết đơn hàng
var load_detail_contract = async (req, res, next) => {
    var id_contract = req.params.id;
    await contractSchema.find({ _id: id_contract }, (err, docs) => {
        var contractChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            contractChunks.push(docs.slice(i, i + chunkSize));
        }

        res.render('shipper/pages/sp_detail', { contracts: contractChunks });
    }).populate('product_id shipper_id buyer_id seller_id')
}

//load đơn hàng đã nhận (đã báo giá vận chuyển)
var load_contract_manager = async (req, res, next) => {
    await contractSchema.find({ shipper_id: req.session.userId, $or: [{ 'status': "4" }, { 'status': "5" }, { 'status': "6" }] }, (err, docs) => {
        var contractChunks = [];
        var chunkSize = 1;
        for (var i = 0; i < docs.length; i += chunkSize) {
            contractChunks.push(docs.slice(i, i + chunkSize));
        }
        var page = parseInt(req.query.page) || 1;
        var perPage = 5;
        var start = (page - 1) * perPage;
        var end = page * perPage;
        var num_page = Math.ceil(docs.length / perPage)
        contractChunks = contractChunks.slice(start, end)

        res.render('shipper/pages/sp_contract', { contracts: contractChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
    }).sort({ status: -1 }).populate('product_id buyer_id seller_id')
}

// load dữ liệu trang cá nhân
var load_profile = async (req, res, next) => {
    await userSchema.find({ _id: req.session.userId }, async (err, docs) => {
        var userChunks = [];
        var chunkSize = 1;
        for (var i = 0; i < docs.length; i += chunkSize) {
            userChunks.push(docs.slice(i, i + chunkSize));
        }
        await contractSchema.find({ shipper_id: req.session.userId, status: '7' }, (err, docs) => {
            var contractChunks = [];
            var chunkSize = 1;
            for (var i = 0; i < docs.length; i += chunkSize) {
                contractChunks.push(docs.slice(i, i + chunkSize));
            }
            var page = parseInt(req.query.page) || 1;
            var perPage = 5;
            var start = (page - 1) * perPage;
            var end = page * perPage;
            var num_page = Math.ceil(docs.length / perPage)
            contractChunks = contractChunks.slice(start, end)

            res.render('shipper/pages/sp_profile', { contracts: contractChunks, users: userChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
        }).sort({ status: -1 }).populate('product_id buyer_id seller_id shipper_id')
    })
}

// Load trang báo giá vận chuyển
var load_shipPrice = async (req, res, next) => {
    var id = req.params.id;
    contractSchema.find({ _id: id, status: '3' }, async (err, doc) => {
        var contractChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < doc.length; i += chunkSize) {
            contractChunks.push(doc.slice(i, i + chunkSize));
        }
        res.render('shipper/pages/sp_send_shipPrice', { contracts: contractChunks, success: req.flash('success'), message: req.flash('message') });
    }).populate('product_id buyer_id seller_id')
}

module.exports = {
    load_contract,
    load_profile,
    load_contract_manager,
    load_detail_contract,
    load_shipPrice
}