var productSchema = require('../../data/models/product')
var contractSchema = require('../../data/models/contract')
var warehouseSchema = require('../../data/models/warehouse')
var Messages = require('./../../data/messages.json');

var today = new Date();

// Tạo đơn mua hàng
var create_contract = async (req, res, next) => {
    var id_product = req.body.product_id;
    var id_supplier = req.body.supplier_id;
    var contract = new contractSchema({
        product_id: id_product,
        seller_id: id_supplier,
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
        res.redirect('/customer');
    }
    else{
        contract.save().then(() => {
            console.log('Create new contract successfully.');
            req.flash('success', Messages.contract.create.success);
            res.redirect('/customer');
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
            res.redirect('/customer/manacontract');
        }
        else {
            warehouseSchema.findOne({ product_id: doc.product_id, supplier_id: doc.seller_id }, (error, product) => {
                if (product.quatity <= 0) {
                    console.log('Accept contract failed. No product left in warehouse.');
                    req.flash('message', Messages.product.unavailabled);
                    res.redirect('/customer/manacontract');
                }
                else {
                    product.quatity = product.quatity - 1;
                    product.save().then(() => {
                        console.log("Update quatity of seller's warehouse successfully.");
                    });

                    doc.acceptDate = today;
                    doc.status = "2";
                    doc.save().then(() => {
                        console.log('Accept contract successfully.');
                        req.flash('success', Messages.contract.accept.success);
                        res.redirect('/customer/manacontract');
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
            res.redirect('/customer/manacontract');
        }
        else {
            doc.status = "6";
            doc.deleteBy = req.session.userId;
            doc.deleteDate = today;
            doc.save().then(() => {
                console.log('Cancel contract successfully.');
                req.flash('success', Messages.contract.cancel.success);
                res.redirect('/customer/manacontract');
            });
        }
    });
}

// Xác nhận nhận hàng
var done_contract = (req, res, next) => {
    var id_contract = req.params.id;
    contractSchema.findOne({ _id: id_contract, status: "4" }, function (err, doc) {
        if (doc == null || doc.length == 0) {
            console.log('Received product failed. Can not find contract.');
            req.flash('message', Messages.contract.ship_notFound);
            res.redirect('/customer/manacontract');
        }
        else {
            doc.status = "5";
            doc.receiveDate = today;
            doc.save().then(() => {
                console.log('Received product successfully.');
                req.flash('success', Messages.contract.receive.success);
                res.redirect('/customer/manacontract');
            });
        }
    })
}

module.exports = {
    create_contract,
    accept_contract,
    cancel_contract,
    done_contract,
}