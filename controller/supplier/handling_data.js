var productSchema = require('./../../data/models/product')
var contractSchema = require('../../data/models/contract')
var wareHouseSchema = require('../../data/models/warehouse')
var mongoose = require('mongoose')
var DBurl = require('./../../data/config')
mongoose.connect(DBurl.url)

var today = new Date();

// Báo giá 
var send_price = async (req, res, next) => {
    var id_contract = req.body.contract_id;
    var price = req.body.price;
    contractSchema.findOne({ _id: id_contract, status: '0' }, (err, doc) => {
        if (doc == null) {
            res.redirect('/supplier');
        }
        else {
            doc.price = price;
            doc.status = "1";
            doc.save().then(() => {
                console.log('Send price successfully')
            });
            res.redirect('/supplier');
        }
    })
}

// Cho phép giao hàng
var delivery_contract = (req, res) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, status: '2' }, (err, doc) => {
        if (doc == null) {
            res.redirect('/supplier');
        }
        else {
            doc.status = "3";
            doc.save().then(() => {
                console.log('Release contract successfully')
            });
            res.redirect('/supplier');
        }
    })
}

// Xóa đơn hàng
var delete_contract = (req, res) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, $or: [{ 'status': "0" }, { 'status': "1" }] }, function (err, doc) {
        if (doc == null) {
            res.redirect('/supplier');
        }
        else {
            doc.status = "6";
            doc.deleteBy = req.session.userId;
            doc.deleteDate = today;
            doc.save().then(() => {
                console.log('Delete contract successfully')
            })
        }
    })
    res.redirect('/supplier');
}

// Tạo đơn mua hàng
var create_contract = async (req, res, next) => {
    var id_product = req.body.product_id;
    var id_manufacturer = req.body.manufacturer_id;
    console.log(id_product);
    console.log(id_manufacturer);
    var contracts = new contractSchema({
            product_id: id_product, 
            seller_id: id_manufacturer, 
            buyer_id: req.session.userId, 
            shipper_id: null,
            quatity: 1,     // fix value
            price: null, 
            currency: 'USD',// fix value
            createBy: req.session.userId,
            createDate: today,
            deleteBy: null,
            deleteDate: null,
            acceptDate: null,
            shipDate: null,
            receiveDate: null,
            status: '0'
        });
    contracts.save().then(() => {
        console.log('Create new contract successfully');
    })
    res.redirect('/supplier/market');
}

// Chấp nhận báo giá
var accept_contract = (req, res, next) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, status: "1" }, function (err, doc) {
        if (doc == null) {
            res.redirect('/supplier/manacontract');
        }
        else {
            wareHouseSchema.find({product_id:doc.product_id,supplier_id:doc.seller_id},(error, product) => {
                if(product.quatity <= 0){
                    return;
                }
                else{
                    product.quatity -= 1;
                    product.save().then(() => {
                        console.log("Update quatity of seller's warehouse successfully");
                    });
                    doc.acceptDate = today;
                    doc.status = "2";
                    doc.save().then(() => {
                        console.log('Accept contract successfully')
                    });
                }
            })
        }
        res.redirect('/supplier/manacontract');
    })
}

//Xác nhận nhận hàng
var done_contract = (req, res, next) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, status: "4" }, function (err, doc) {
        if (doc == null) {
            res.redirect('/supplier/manacontract');
        }
        else {
            doc.status = "5";
            doc.receiveDate = today;
            doc.save().then(() => {
                console.log('Received product');
            });

            res.redirect('/supplier/manacontract');
        }
    })
}

// Hủy đơn mua hàng
var cancel_contract = (req, res) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, $or: [{ 'status': "0" }, { 'status': "1" }] }, function (err, doc) {
        if (doc == null) {
            res.redirect('/supplier/manacontract');
        }
        else {
            doc.status = "6";
            doc.deleteBy = req.session.userId;
            doc.deleteDate = today;
            doc.save().then(() => {
                console.log('Cancel contract successfully')
            })
        }
        res.redirect('/supplier/manacontract');
    })
}

// Xóa sản phẩm khỏi kho chứa
var delete_product = (req, res, next) => {
    var id_product = req.params.id;
    wareHouseSchema.remove({product_id:id_product,supplier_id:req.session.userId},(error, product) => {
        console.log("Remove product succesfullly");
        res.redirect('/supplier/product');
    })
}

module.exports = {
    delivery_contract,
    send_price,
    cancel_contract,
    delete_contract,
    create_contract,
    accept_contract,
    done_contract,
    delete_product,
}