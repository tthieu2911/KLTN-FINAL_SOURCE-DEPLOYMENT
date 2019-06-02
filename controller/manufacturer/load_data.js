var contractSchema = require('../../data/models/contract')
var userSchema = require('./../../data/models/user')
var productSchema = require('../../data/models/product')
var warehouseSchema = require('../../data/models/warehouse')
var user_load = require('../user/load_page');

// load dữ liệu cho trang index supplier
var load_contract = async (req, res, next) => {
    await contractSchema.find({ seller_id: req.session.userId, status: { $ne: '7' } }, (err, docs) => {
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

        res.render('manufacturer/mf_index', { contracts: contractChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
    }).sort({ createDate: -1 }).populate('buyer_id product_id shipper_id')
}

// load dữ liệu sản phẩm của manufacturer đang đăng nhập
var load_product = async (req, res, next) => {
    warehouseSchema.find({ owner_id: req.session.userId }, async (error, docs) => {
        var warehouseChunks = [];
        var chunkSize = 1;
        for (var i = 0; i < docs.length; i += chunkSize) {
            warehouseChunks.push(docs.slice(i, i + chunkSize));
        }
        var page = parseInt(req.query.page) || 1;
        var perPage = 6;
        var start = (page - 1) * perPage;
        var end = page * perPage;
        var num_page = Math.ceil(docs.length / perPage)
        warehouseChunks = warehouseChunks.slice(start, end)

        res.render('manufacturer/pages/mf_list_product', { warehouses: warehouseChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
    }).sort({ name: -1 }).populate('product_id manufacturer_id owner_id')
}

// load dữ liệu báo giá sản phẩm
var load_price = async (req, res) => {
    var id = req.params.id;
    contractSchema.find({ _id: id, status: '0' }, async (err, doc) => {
        await contractSchema.find({ '_id': id }, (err, docs) => {
            var contractChunks = [];
            var chunkSize = 3;
            for (var i = 0; i < docs.length; i += chunkSize) {
                contractChunks.push(docs.slice(i, i + chunkSize));
            }

            var warehouseChunks = [];
            warehouseSchema.find({product_id: docs[0].product_id, owner_id: docs[0].seller_id}, (e, product) => {
                for (var i = 0; i < product.length; i += 1) {
                    warehouseChunks.push(product.slice(i, i + 1));
                }
            })

            res.render('manufacturer/pages/mf_send_price', { contracts: contractChunks, warehouses: warehouseChunks, success: req.flash('success'), message: req.flash('message') });
        }).populate('product_id buyer_id')
    })
}

// load dữ liệu manufacturer
var load_profile = async (req, res, next) => {
    await userSchema.find({ _id: req.session.userId }, async (err, docs) => {
        var userChunks = [];
        var chunkSize = 1;
        for (var i = 0; i < docs.length; i += chunkSize) {
            userChunks.push(docs.slice(i, i + chunkSize));
        }

        await contractSchema.find({ seller_id: req.session.userId, status: '7' }, (err, contr) => {
            var contractChunks = [];
            var chunkSize = 1;
            for (var i = 0; i < contr.length; i += chunkSize) {
                contractChunks.push(contr.slice(i, i + chunkSize));
            }
            var page = parseInt(req.query.page) || 1;
            var perPage = 5;
            var start = (page - 1) * perPage;
            var end = page * perPage;
            var num_page = Math.ceil(contr.length / perPage)
            contractChunks = contractChunks.slice(start, end)

            res.render('manufacturer/pages/mf_profile', { contracts: contractChunks, users: userChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
        }).sort({ createDate: -1 }).populate('product_id shipper_id seller_id buyer_id')
    })
}

// load chi tiết đơn bán hàng
var load_detail_contract = async (req, res, next) => {
    var id_contract = req.params.id;
    await contractSchema.find({ _id: id_contract }, (err, docs) => {
        var contractChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            contractChunks.push(docs.slice(i, i + chunkSize));
        }

        res.render('manufacturer/pages/mf_detail', { contracts: contractChunks });
    }).populate('product_id shipper_id buyer_id seller_id')
}

// load thông tin sản phẩm để chỉnh sửa
var load_update_product = async (req, res) => {
    var id = req.params.id;
    warehouseSchema.find({ product_id: id, owner_id: req.session.userId }, async (err, doc) => {
        var warehouseChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < doc.length; i += chunkSize) {
            warehouseChunks.push(doc.slice(i, i + chunkSize));
        }
        res.render('manufacturer/pages/mf_edit_product', { warehouses: warehouseChunks, success: req.flash('success'), message: req.flash('message') });
    }).populate('product_id owner_id');
}

module.exports = {
    load_contract,
    load_price,
    load_product,
    load_update_product,
    load_profile,
    load_detail_contract,
}