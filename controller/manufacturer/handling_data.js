var productSchema = require('./../../data/models/product')
var contractSchema = require('../../data/models/contract')
var warehouseSchema = require('../../data/models/warehouse')
var Messages = require('./../../data/messages.json');
var mongoose = require('mongoose')
var DBurl = require('./../../data/config')
mongoose.connect(DBurl.url)

var today = new Date();

// Tạo sản phẩm
var create_product = (req, res) => {
    var nameProduct = req.body.nameProduct;
    var quatity = req.body.quatity;
    var desription = req.body.desription;
    var dateExpire = req.body.expireDate;
    var dateCreate = today;
    if (req.body.createDate != null) {
        dateCreate = req.body.createDate;
    }
    if (dateExpire < dateCreate && dateExpire != null) {
        console.log('create new product failed. Wrong expiry date.');
        req.flash('message', Messages.product.invalid_expireDate);
    }
    else {
        var product = new productSchema({
            name: nameProduct,
            desription: desription,
            manufacturer_id: req.session.userId,
            createDate: dateCreate,
            expireDate: dateExpire,
        })

        var warehouse = new warehouseSchema({
            product_id: product._id,
            supplier_id: req.session.userId,
            quatity: quatity
        })

        if (product == null || warehouse == null) {
            console.log('create new product failed. Can not create Object.');
            req.flash('message', Messages.product.create.failed);
        }
        else {
            product.save();
            warehouse.save();
            console.log('create new product successfully.');
            req.flash('success', Messages.product.create.success);
        }
    }
    res.redirect('/manufacturer/product');
}

//  Sửa sản phẩm
var edit_product = (req, res, next) => {
    var nameproduct = req.body.nameproduct;
    var description = req.body.description;
    var id_product = req.body.id_product;
    var quatity = req.body.quatity;
    var dateExpire = req.body.expireDate;
    var dateCreate = today;
    if (req.body.createDate != null) {
        dateCreate = req.body.createDate;
    }
    if (dateExpire < dateCreate && dateExpire != null) {
        console.log('Update new product failed. Wrong expiry date.');
        req.flash('message', Messages.product.edit.failed);
        res.redirect('/manufacturer/product');
    }

    productSchema.findOne({ _id: id_product, manufacturer_id: req.session.userId }, (err, doc) => {
        if (doc == null || doc.length == 0) {
            console.log("Update manufacturer 's warehouse failed. Can not find product in warehouse.");
            req.flash('message', Messages.product.not_Found);
        }
        else {
            warehouseSchema.findOne({ product_id: id_product, supplier_id: req.session.userId }, (err, product) => {
                if(product == null || product.length == 0){
                    console.log("Update manufacturer 's warehouse failed. Can not find product in warehouse.");
                    req.flash('message', Messages.product.unavailabled);
                }
                else{
                    product.quatity = quatity;
                    product.save().then(() => {
                        console.log("Update manufacturer 's warehouse successful.");
                    })
                    doc.name = nameproduct;
                    doc.desription = description;
                    doc.createDate = dateCreate;
                    doc.expireDate = dateExpire;
                    doc.save().then(() => {
                        console.log('Update product successfully.');
                        req.flash('success', Messages.product.edit.success);
                    });
                }
            });
        }
        res.redirect('/manufacturer/product');
    })
}

// Xóa sản phẩm khỏi kho chứa
var delete_product = (req, res, next) => {
    var id_product = req.params.id;
    warehouseSchema.remove({ product_id: id_product, supplier_id: req.session.userId }, (error, product) => {
        if (product == null || product.length == 0) {
            console.log("Can not find product in warehouse.");
            req.flash('message', Messages.product.unavailabled);
        }
        else {
            console.log("Remove product succesfully.");
            req.flash('success', Messages.product.delete.success);
        }
        res.redirect('/manufacturer/product');
    })
}

// Báo giá 
var send_price = (req, res, next) => {
    var id_contract = req.body.contract_id;
    var price = req.body.price;
    contractSchema.findOne({ _id: id_contract, status: '0' }, (err, doc) => {
        if (doc == null || doc.length == 0) {
            console.log("Send price failed. Can not find contract.");
            req.flash('message', Messages.contract.not_Found);
        }
        else {
            doc.price = price;
            doc.status = "1";
            doc.save().then(() => {
                console.log('Send price successfully.')
            });
            req.flash('success', Messages.contract.send_price.success);
        }
        res.redirect('/manufacturer');
    })
}

// Cho phép giao hàng
var delivery_contract = (req, res) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, status: '2' }, (err, doc) => {
        if (doc == null || doc.length == 0) {
            console.log('Release contract failed. Can not find contract.');
            req.flash('message', Messages.contract.not_Found);
        }
        else {
            doc.status = "3";
            doc.save().then(() => {
                console.log('Release contract successfully.');
                req.flash('success', Messages.contract.allow_to_ship.success);
            });
        }
        res.redirect('/manufacturer');
    })
}

// Xóa đơn hàng
var delete_contract = (req, res) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, $or: [{ 'status': "0" }, { 'status': "1" }] }, function (err, doc) {
        if (doc == null || doc.length == 0) {
            console.log('Release contract failed. Can not find contract.');
            req.flash('message', Messages.contract.not_Found);
        }
        else {
            doc.status = "6";
            doc.deleteBy = req.session.userId;
            doc.deleteDate = today;
            doc.save().then(() => {
                console.log('Delete contract successfully.')
                req.flash('success', Messages.contract.delete.success);
            })
        }
        res.redirect('/manufacturer');
    })
}

module.exports = {
    create_product,
    delete_product,
    edit_product,
    send_price,
    delivery_contract,
    delete_contract
}