var productSchema = require('./../../data/models/product')
var contractSchema = require('../../data/models/contract')
var mongoose = require('mongoose')
var DBurl = require('./../../data/config')
mongoose.connect(DBurl.url)

// Tạo sản phẩm
var create_product = (req, res) => {
    var nameProduct = req.body.nameProduct;
    var desription = req.body.desription;
    var products = new productSchema({ name: nameProduct, desription: desription, supplier_id: req.session.userId, del: true })
    products.save().then(() => {
        console.log('insert products success');
    })
    res.redirect('/supplier/product');
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
                console.log('Update contract status accept success')
            });
            res.redirect('/supplier');
        }
    })
}

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
                console.log('Update contract success')
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
            doc.save().then(() => {
                console.log('Update contract status cancel success')
            })
        }
    })
    res.redirect('/supplier');
}

// Tạo đơn mua hàng
var create_contract = async (req, res, next) => {
    var id_product = req.body.product_id;
    var id_supplier = req.body.supplier_id;
    console.log(id_product);
    console.log(id_supplier);
    var contracts = new contractSchema({ product_id: id_product, supplier_id: id_supplier, customer_id: req.session.userId, price: null, shipper_id: null, status: '0' })
    contracts.save().then(() => {
        console.log('insert contract success');
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
            doc.status = "2";
            doc.save().then(() => {
                console.log('Update contract status accept success')
            });

            res.redirect('/supplier/manacontract');
        }
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
            doc.save().then(() => {
                console.log('Update contract status done success')
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
            doc.save().then(() => {
                console.log('Update contract status cancel success')
            })
        }
        res.redirect('/supplier/manacontract');
    })
}

// Xóa sản phẩm
var delete_product = (req, res, next) => {
    var id_product = req.params.id;
    productSchema.findOne({ _id: id_product }, function (err, doc) {
        if (doc == null) {
            res.redirect('/supplier/product');
        }
        else {
            doc.del = false;
            doc.save().then(() => {
                console.log('delete done success')
            });

            res.redirect('/supplier/product');
        }
    })
}

//  Sửa sản phẩm
var edit_product = (req, res, next) => {
    var nameproduct = req.body.nameproduct;
    var description = req.body.description;
    var id_product = req.body.id_product;
    var id_supplier = req.session.userId;
    productSchema.findOne({ _id: id_product, supplier_id: id_supplier}, (err, doc) => {
        if (doc == null) {
            res.redirect('/supplier/product');
        }
        else {
            doc.name = nameproduct;
            doc.desription = description;
            doc.save().then(() => {
                console.log('Update product successfully')
            });

            res.redirect('/supplier/product');
        }
    })
}

module.exports = {
    create_product,
    delivery_contract,
    send_price,
    cancel_contract,
    delete_contract,
    create_contract,
    accept_contract,
    done_contract,
    delete_product,
    edit_product,
}