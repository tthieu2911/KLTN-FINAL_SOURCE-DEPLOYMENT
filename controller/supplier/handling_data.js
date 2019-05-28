var productSchema = require('./../../data/models/product');
var contractSchema = require('../../data/models/contract');
var warehouseSchema = require('../../data/models/warehouse');
var Messages = require('./../../data/messages.json');
var mongoose = require('mongoose');
var DBurl = require('./../../data/config');
mongoose.connect(DBurl.url)

var today = new Date();

// Báo giá 
var send_price = async (req, res, next) => {
    var id_contract = req.body.contract_id;
    var price = req.body.price;
    contractSchema.findOne({ _id: id_contract, status: '0' }, (err, doc) => {
        if (doc == null || doc.length == 0) {
            console.log('Send price failed. Can not find contract.');
            req.flash('message', Messages.contract.sell_notFound);
            res.redirect('/supplier');
        }
        else {
            doc.price = price;
            doc.status = "1";
            doc.save().then(() => {
                console.log('Send price successfully.');
                req.flash('success', Messages.contract.send_price.success);
                res.redirect('/supplier');
            });
        }
    })
}

// Cho phép giao hàng
var delivery_contract = (req, res) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, status: '2' }, (err, doc) => {
        if (doc == null) {
            console.log('Release contract failed. Can not find contract.');
            req.flash('message', Messages.contract.sell_notFound);
            res.redirect('/supplier');
        }
        else {
            doc.status = "3";
            doc.save().then(() => {
                console.log('Release contract successfully');
                req.flash('success', Messages.contract.allow_to_ship.success);
                res.redirect('/supplier');
            });
        }
    })
}

// Xóa đơn hàng
var delete_contract = (req, res) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, $or: [{ 'status': "0" }, { 'status': "1" }] }, function (err, doc) {
        if (doc == null || doc.length == 0) {
            console.log('Delete contract failed. Can not contract.');
            req.flash('message', Messages.contract.sell_notFound);
            res.redirect('/supplier');
        }
        else {
            doc.status = "6";
            doc.deleteBy = req.session.userId;
            doc.deleteDate = today;
            doc.save().then(() => {
                console.log('Delete contract successfully');
                req.flash('success', Messages.contract.delete.success);
                res.redirect('/supplier');
            })
        }
    })
}

// Tạo đơn mua hàng
var create_contract = async (req, res, next) => {
    var id_product = req.body.product_id;
    var id_manufacturer = req.body.manufacturer_id;
    console.log(id_product);
    console.log(id_manufacturer);
    var contract = new contractSchema({
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

    if(contract == null){
        console.log('Create new contract failed. Can not create object.');
        req.flash('message', Messages.contract.create.failed);
        res.redirect('/supplier/market');
    }
    else{
        contract.save().then(() => {
            console.log('Create new contract successfully');
            req.flash('success', Messages.contract.create.success);
            res.redirect('/supplier/market');
        })
    }
}

// Chấp nhận báo giá
var accept_contract = (req, res, next) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, status: "1" }, function (err, doc) {
        if (doc == null || doc.length == 0) {
            console.log('Accept contract failed. Can not find contract.');
            req.flash('message', Messages.contract.price_notFound);
            res.redirect('/supplier/manacontract');
        }
        else {
            warehouseSchema.findOne({ product_id: doc.product_id, supplier_id: doc.seller_id }, (error, product) => {
                if (product.quatity <= 0) {
                    console.log('Accept contract failed. No product left in warehouse.');
                    req.flash('message', Messages.product.unavailabled);
                    res.redirect('/supplier/manacontract');
                }
                else {
                    product.quatity = product.quatity - 1;
                     product.save().then(() => {
                        console.log("Update quatity of seller's warehouse successfully.");
                    });
                    
                    doc.acceptDate = today;
                    doc.status = "2";
                    doc.save().then(() => {
                        console.log('Accept contract successfully');
                        req.flash('success', Messages.contract.accept.success);
                        res.redirect('/supplier/manacontract');
                    });
                }
            })
        }
    })
}

//Xác nhận nhận hàng
var done_contract = (req, res, next) => {
    var id_contract = req.params.id;
    contractSchema.findOne({ _id: id_contract, status: "4" }, function (err, doc) {
        if (doc == null || doc.length == 0) {
            console.log('Received product failed. Can not find contract.');
            req.flash('message', Messages.contract.ship_notFound);
            res.redirect('/supplier/manacontract');
        }
        else {
            warehouseSchema.find({ product_id: doc.product_id, supplier_id: req.session.userId }, (error, product) => {
                if (product == null || product.length == 0) {
                    var warehouse = new warehouseSchema({
                        product_id: doc.product_id,
                        supplier_id: req.session.userId,
                        quatity: doc.quatity
                    })

                    if(warehouse == null){
                        console.log("Update quatity of seller's warehouse failed. Can not create object.");
                        req.flash('message', Messages.contract.receive.failed);
                        res.redirect('/supplier/manacontract');
                    }
                    else{
                        warehouse.save().then(() => {
                            console.log("Update quatity of seller's warehouse successfully.");
                        })

                        doc.status = "5";
                        doc.receiveDate = today;
                        doc.save().then(() => {
                            console.log('Received product successfully.');
                            req.flash('success', Messages.contract.receive.success);
                            res.redirect('/supplier/manacontract');
                        });
                    }
                }
                else {
                    product[0].quatity = product[0].quatity + 1;
                    product[0].save().then(() => {
                        console.log("Update quatity of seller's warehouse successfully.");
                    });

                    doc.status = "5";
                    doc.receiveDate = today;
                    doc.save().then(() => {
                        console.log('Received product successfully.');
                        req.flash('success', Messages.contract.receive.success);
                        res.redirect('/supplier/manacontract');
                    });
                }
            })
        }
    })
}

// Hủy đơn mua hàng
var cancel_contract = (req, res) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, $or: [{ 'status': "0" }, { 'status': "1" }] }, function (err, doc) {
        if (doc == null || doc.length == 0) {
            console.log('Cancel contract failed. Can not find contract.');
            req.flash('message', Messages.contract.buy_notFound);
            res.redirect('/supplier/manacontract');
        }
        else {
            doc.status = "6";
            doc.deleteBy = req.session.userId;
            doc.deleteDate = today;
            doc.save().then(() => {
                console.log('Cancel contract successfully.');
                req.flash('success', Messages.contract.cancel.success);
                res.redirect('/supplier/manacontract');
            })
        }
    })
}

// Xóa sản phẩm khỏi kho chứa
var delete_product = (req, res, next) => {
    var id_product = req.params.id;
    warehouseSchema.remove({ product_id: id_product, supplier_id: req.session.userId }, (error, product) => {
        if(product == null || product.length == 0){
            console.log("Remove product failed. Can not find product.");
            req.flash('message', Messages.product.unavailabled);
            res.redirect('/supplier/product');
        }
        else{
            console.log("Remove product succesfullly.");
            req.flash('success', Messages.product.delete.success);
            res.redirect('/supplier/product');
        }
    })
}

module.exports = {
    // Handling selling biz
    send_price,
    delivery_contract,
    cancel_contract,
    delete_contract,

    // Handling buying biz
    create_contract,
    accept_contract,
    done_contract,

    // Handling product in warehouse
    delete_product,
}