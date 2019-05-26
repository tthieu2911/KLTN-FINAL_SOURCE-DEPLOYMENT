var productSchema = require('./../../data/models/product')
var contractSchema = require('../../data/models/contract')
var wareHouseSchema = require('../../data/models/warehouse')
var mongoose = require('mongoose')
var DBurl = require('./../../data/config')
mongoose.connect(DBurl.url)

var today = new Date();
// Tạo sản phẩm
var create_product = (req, res) => {
    var nameProduct = req.body.nameProduct;
    var desription = req.body.desription;
    var dateExpire = req.body.expireDate;
    var dateCreate = today;
    if (req.body.createDate != null){
        dateCreate = req.body.createDate;
    }
    if(dateExpire < dateCreate && dateExpire != null){
        return;
    }
    else{
        var products = new productSchema({ 
            name: nameProduct, 
            desription: desription, 
            manufacturer_id: req.session.userId,
            createDate: dateCreate,
            expireDate: dateExpire,
        })
        products.save().then(() => {
            console.log('create new product successfully');
        })
        res.redirect('/manufacturer/product');
    }
}

//  Sửa sản phẩm
var edit_product = (req, res, next) => {
    var nameproduct = req.body.nameproduct;
    var description = req.body.description;
    var id_product = req.body.id_product;
    var id_manufacturer = req.session.userId;
    var dateExpire = req.body.expireDate;
    var dateCreate = today;
    if (req.body.createDate != null){
        dateCreate = req.body.createDate;
    }
    if(dateExpire < dateCreate && dateExpire != null){
        return;
    }
    productSchema.findOne({ _id: id_product, manufacturer_id: id_manufacturer}, (err, doc) => {
        if (doc == null) {
            res.redirect('/manufacturer/product');
        }
        else {
            doc.name = nameproduct;
            doc.desription = description;
            doc.createDate = dateCreate;
            doc.expireDate = dateExpire;
            doc.save().then(() => {
                console.log('Update product successfully')
            });
            res.redirect('/manufacturer/product');
        }
    })
}

// Xóa sản phẩm khỏi kho chứa
var delete_product = (req, res, next) => {
    var id_product = req.params.id;
    wareHouseSchema.remove({product_id:id_product,supplier_id:req.session.userId},(error, product) => {
        console.log("Remove product succesfully");
        res.redirect('/supplier/product');
    })
}

// Báo giá 
var send_price = async (req, res, next) => {
    var id_contract = req.body.contract_id;
    var price = req.body.price;
    contractSchema.findOne({ _id: id_contract, status: '0' }, (err, doc) => {
        if (doc == null) {
            res.redirect('/manufacturer');
        }
        else {
            doc.price = price;
            doc.status = "1";
            doc.save().then(() => {
                console.log('Send price successfully')
            });
            res.redirect('/manufacturer');
        }
    })
}

// Cho phép giao hàng
var delivery_contract = (req, res) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, status: '2' }, (err, doc) => {
        if (doc == null) {
            res.redirect('/manufacturer');
        }
        else {
            doc.status = "3";
            doc.save().then(() => {
                console.log('Release contract successfully')
            });
            res.redirect('/manufacturer');
        }
    })
}

// Xóa đơn hàng
var delete_contract = (req, res) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, $or: [{ 'status': "0" }, { 'status': "1" }] }, function (err, doc) {
        if (doc == null) {
            res.redirect('/manufacturer');
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
    res.redirect('/manufacturer');
}

module.exports = {
    create_product,
    delete_product,
    edit_product,
    send_price,
    delivery_contract,
    delete_contract
}