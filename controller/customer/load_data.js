var productSchema = require('../../data/models/product')
var contractSchema = require('../../data/models/contract')
var userSchema = require('../../data/models/user')
var warehouseSchema = require('../../data/models/warehouse')
var Messages = require('./../../data/messages.json');

var user_load = require('../user/load_page');

// load dữ liệu sản phẩm để mua
var load_product = async (req, res, next) => {

    userSchema.find({ type: "retailer" }, (error, user) => {
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
                    "quatity": {$ne: 0},
                    "owner_info.type": "retailer"
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

            res.render('customer/ctm_index', { results: resultChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
        })
    }) 
}

var load_contract_to_buy = async (req, res, next) => {
    var id_product = req.body.product_id;
    var id_owner = req.body.owner_id;
    warehouseSchema.find({ product_id: id_product, owner_id: id_owner }, (err, product) => {
        if(product == null || product.length == 0){
            console.log('create contract failed. No product left in warehouse.');
            req.flash('message', Messages.product.unavailabled);
            res.redirect('/customer');
        }
        else{
            var warehouseChunks = [];
            var chunkSize = 1;
            for (var i = 0; i < product.length; i += chunkSize) {
                warehouseChunks.push(product.slice(i, i + chunkSize));
            }

            res.render('customer/pages/ctm_create_contract', { warehouses: warehouseChunks, success: req.flash('success'), message: req.flash('message') });
        }
    }).populate('product_id owner_id')
}

// Load dữ liệu thông tin customer
var load_profile = async (req, res, next) => {
    await userSchema.find({ _id: req.session.userId }, async (err, user) => {
        var userChunks = [];
        var chunkSize = 1;
        for (var i = 0; i < user.length; i += chunkSize) {
            userChunks.push(user.slice(i, i + chunkSize));
        }
        await contractSchema.find({ buyer_id: req.session.userId, status: '7' }, (err, docs) => {
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
            res.render('customer/pages/ctm_profile', { contracts: contractChunks, users: userChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
        }).sort({ createDate: -1 }).populate('product_id shipper_id seller_id')
    })
}

// Quản lí tình trạng đơn mua hàng
var load_contract_manager = async (req, res, next) => {
    await contractSchema.find({ buyer_id: req.session.userId, status: { $ne: '7' } }, async (err, docs) => {
        var page = parseInt(req.query.page) || 1;
        var perPage = 5;
        var start = (page - 1) * perPage;
        var end = page * perPage;
        var contractChunks = [];
        var chunkSize = 1;
        for (var i = 0; i < docs.length; i += chunkSize) {
            contractChunks.push(docs.slice(i, i + chunkSize));
        }
        var num_page = Math.ceil(docs.length / perPage)
        contractChunks = contractChunks.slice(start, end)
        res.render('customer/pages/ctm_contract', { contracts: contractChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
    }).sort({ createDate: -1 }).populate('product_id shipper_id seller_id')
}

// load chi tiết đơn hàng
var load_detail_contract = async (req, res, next) => {
    var id_contract = req.params.id;
    await contractSchema.find({ _id: id_contract }, (err, docs) => {

        var contractChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            contractChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('customer/pages/ctm_detail', { contracts: contractChunks });
    }).populate('product_id shipper_id buyer_id seller_id')
}


///
var load_contract_for_payment = async (req, res, next) => {
    var id_contract = req.params.id;
    await contractSchema.find({ _id: id_contract }, (err, docs) => {
        var contractChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            contractChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('customer/pages/ctm_payment', { contracts: contractChunks });
    }).populate('product_id shipper_id customer_id supplier_id')
}

module.exports = {
    load_product,
    load_contract_to_buy,
    load_profile,
    load_contract_manager,
    load_detail_contract,
    load_contract_for_payment
}