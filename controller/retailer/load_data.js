var contractSchema = require('../../data/models/contract')
var userSchema = require('./../../data/models/user')
var productSchema = require('../../data/models/product')
var warehouseSchema = require('../../data/models/warehouse')
var user_load = require('../user/load_page');
var Messages = require('./../../data/messages.json');
var mongoose = require('mongoose');
var DBurl = require('../../data/config');
mongoose.connect(DBurl.url)

// Danh sách đơn bán hàng
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

        res.render('retailer/rt_index', { contracts: contractChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
    }).sort({ createDate: -1 }).populate('buyer_id product_id shipper_id')
}

// load dữ liệu sản phẩm để mua
var load_product_to_buy = async (req, res, next) => {
    /*userSchema.find({ type: "supplier" }, async (error, user) => {
        var id_owner = user;
        warehouseSchema.find({ quatity: { $ne: 0 }, owner_id: id_owner }, (error, docs) => {

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

            res.render('retailer/pages/rt_buy_product', { warehouses: warehouseChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
        }).sort({ name: -1 }).populate('product_id owner_id product_id.manufacturer_id')
    }) */

    userSchema.find({ type: "supplier" }, (error, user) => {
        id_seller = user;

        warehouseSchema.aggregate([
            {
                "$lookup": {
                    "from": "products",
                    "localField": "product_id",
                    "foreignField": "_id",
                    "as": "product_info",
                },
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "owner_id",
                    "foreignField": "_id",
                    "as": "owner_info"
                },
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "product_info.manufacturer_id",
                    "foreignField": "_id",
                    "as": "manu_info"
                },
            },
            {
                "$match": {
                    "quatity": { $ne: 0 },
                    "owner_info.type": "supplier"
                }
            },
            {
                "$project": {
                    "product_id": 1,
                    "quatity": 1,
                    "product_name": "$product_info.name",
                    "createDate": "$product_info.createDate",
                    "expireDate": "$product_info.expireDate",
                    "description": "$product_info.description",
                    "owner_id": 1,
                    "owner_name": "$owner_info.fullName",
                    "owner_address": "$owner_info.address",
                    "manu_name": "$manu_info.fullName",
                }
            }
        ], (error, docs) => {
            var resultChunks = [];
            var chunkSize = 1;
            for (var i = 0; i < docs.length; i += chunkSize) {
                resultChunks.push(docs.slice(i, i + chunkSize));
            }

            var page = parseInt(req.query.page) || 1;
            var perPage = 6;
            var start = (page - 1) * perPage;
            var end = page * perPage;
            var num_page = Math.ceil(docs.length / perPage)
            resultChunks = resultChunks.slice(start, end)

            res.render('retailer/pages/rt_buy_product', { results: resultChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
        })
    })
}

// load danh sách sản phẩm của retailer đang đăng nhập
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

        res.render('retailer/pages/rt_list_product', { warehouses: warehouseChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
    }).sort({ name: -1 }).populate('product_id manufacturer_id owner_id')
}

// load trang báo giá sản phẩm
var load_price = async (req, res) => {
    var id = req.params.id;
    contractSchema.find({ _id: id, status: '0' }, async (err, doc) => {
        await contractSchema.find({ _id: id }, (err, docs) => {
            var contractChunks = [];
            var chunkSize = 3;
            for (var i = 0; i < docs.length; i += chunkSize) {
                contractChunks.push(docs.slice(i, i + chunkSize));
            }

            var warehouseChunks = [];
            warehouseSchema.find({ product_id: docs[0].product_id, owner_id: docs[0].seller_id }, (e, product) => {
                for (var i = 0; i < product.length; i += 1) {
                    warehouseChunks.push(product.slice(i, i + 1));
                }

                res.render('retailer/pages/rt_send_price', { contracts: contractChunks, warehouses: warehouseChunks, success: req.flash('success'), message: req.flash('message') });
            })

        }).populate('product_id buyer_id')
    })
}

// load thông tin tài khoản retailer
var load_profile = async (req, res, next) => {
    await userSchema.find({ _id: req.session.userId }, async (err, docs) => {
        var userChunks = [];
        var chunkSize = 1;
        for (var i = 0; i < docs.length; i += chunkSize) {
            userChunks.push(docs.slice(i, i + chunkSize));
        }
        await contractSchema.find({ $or: [{ buyer_id: req.session.userId }, { seller_id: req.session.userId }], status: "7" }, (err, docs) => {
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

            res.render('retailer/pages/rt_profile', { contracts: contractChunks, users: userChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
        }).sort({ createDate: -1 }).populate('product_id shipper_id seller_id')
    })
}

//Load dữ liệu theo dõi tình trạng đơn mua hàng
var load_contract_manager = async (req, res, next) => {
    await contractSchema.find({ buyer_id: req.session.userId, status: { $ne: '7' } }, (err, docs) => {
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

        res.render('retailer/pages/rt_contract', { contracts: contractChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
    }).sort({ createDate: -1 }).populate('product_id shipper_id seller_id')
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

        res.render('retailer/pages/rt_detail', { contracts: contractChunks });
    }).populate('product_id shipper_id buyer_id seller_id')
}

// load chi tiết đơn mua hàng
var load_detail_contract_retailer = async (req, res, next) => {
    var id_contract = req.params.id;
    await contractSchema.find({ _id: id_contract }, (err, docs) => {
        var contractChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            contractChunks.push(docs.slice(i, i + chunkSize));
        }

        res.render('retailer/pages/rt_detail', { contracts: contractChunks });
    }).populate('product_id shipper_id buyer_id seller_id')
}

var load_contract_to_buy = async (req, res, next) => {
    var id_product = req.body.product_id;
    var id_owner = req.body.owner_id;
    warehouseSchema.find({ product_id: id_product, owner_id: id_owner }, (err, product) => {
        if (product == null || product.length == 0) {
            console.log('create contract failed. No product left in warehouse.');
            req.flash('message', Messages.product.unavailabled);
            res.redirect('/retailer/market');
        }
        else {
            var warehouseChunks = [];
            var chunkSize = 1;
            for (var i = 0; i < product.length; i += chunkSize) {
                warehouseChunks.push(product.slice(i, i + chunkSize));
            }
            res.render('retailer/pages/rt_create_contract', { warehouses: warehouseChunks, success: req.flash('success'), message: req.flash('message') });
        }
    }).populate('product_id owner_id')
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
        res.render('retailer/pages/rt_edit_product', { warehouses: warehouseChunks, success: req.flash('success'), message: req.flash('message') });
    }).populate('product_id owner_id');
}

module.exports = {
    load_contract,
    load_product_to_buy,
    load_product,
    load_price,
    load_profile,
    load_contract_manager,
    load_detail_contract,
    load_detail_contract_retailer,
    load_contract_to_buy,
    load_update_product
}