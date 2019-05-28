var productSchema = require('../../data/models/product')
var contractSchema = require('../../data/models/contract')
var userSchema = require('../../data/models/user')
var warehouseSchema = require('../../data/models/warehouse')

var user_load = require('../user/load_page');

// load dữ liệu sản phẩm để mua
var load_product = async (req, res, next) => {
    userSchema.find({ type: "supplier" }, async (error, user) => {
        if (user == null || user.length == 0) {
            res.redirect('/customer');
        }
        else {
            var id_supplier = user;
            warehouseSchema.find({ quatity: { $ne: 0 }, supplier_id: id_supplier }, (error, docs) => {
                if (docs == null || docs.length == 0) {
                    res.redirect('/customer');
                }
                else {
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
                    res.render('customer/ctm_index', { warehouses: warehouseChunks, pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });
                }
            }).sort({ name: -1 }).populate('product_id manufacturer_id supplier_id')
        }
        res.redirect('/customer');
    })
}

// Load dữ liệu thông tin customer
var load_profile = async (req, res, next) => {
    await userSchema.find({ _id: req.session.userId }, async (err, user) => {
        if(user == null || user.length == 0){
            res.redirect('/customer/profile');
        }
        else{
            var userChunks = [];
            var chunkSize = 1;
            for (var i = 0; i < user.length; i += chunkSize) {
                userChunks.push(user.slice(i, i + chunkSize));
            }
            await contractSchema.find({ buyer_id: req.session.userId, status: '5' }, (err, docs) => {
                if(docs == null){
                    res.redirect('/customer/profile');
                }
                else{
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
                    res.render('customer/pages/ctm_profile', { contract: contractChunks, users: userChunks, success: req.flash('success'), message: req.flash('message'), pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });    
                }
            }).sort({ status: -1 }).populate('product_id shipper_id seller_id')
        }
        res.redirect('/customer/profile');
    })
}

// Quản lí tình trạng đơn mua hàng
var load_contract_manager = async (req, res, next) => {
    await contractSchema.find({ buyer_id: req.session.userId, status: {$ne: '5'}}, async (err, docs) => {
        if(docs == null || docs.length == 0){
            res.redirect('/customer/manacontract');
        }
        else{
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
            res.render('customer/pages/ctm_contract', { contracts: contractChunks, pagination: { page: page, limit: num_page }, paginateHelper: user_load.createPagination });    
        }
    }).sort({ status: -1 }).populate('product_id shipper_id seller_id')
}

// load chi tiết đơn hàng
var load_detail_contract = async (req, res, next) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    await contractSchema.find({ _id: id_contract }, (err, docs) => {
        if(docs == null || docs.length == 0){
            res.redirect('/customer/manacontract');
        }
        else{
            var contractChunks = [];
            var chunkSize = 3;
            for (var i = 0; i < docs.length; i += chunkSize) {
                contractChunks.push(docs.slice(i, i + chunkSize));
            }
            res.render('customer/pages/ctm_detail', { contracts: contractChunks });
        }
    }).populate('product_id shipper_id buyer_id seller_id')
}


///
var load_contract_for_payment = async (req, res, next) => {
    var id_contract = req.params.id;
    console.log(id_contract);
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
    load_profile,
    load_contract_manager,
    load_detail_contract,
    load_contract_for_payment
}