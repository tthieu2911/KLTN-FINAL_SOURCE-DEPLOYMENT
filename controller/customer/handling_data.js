var productSchema = require('../../data/models/product')
var contractSchema = require('../../data/models/contract')

//  Tạo đơn mua hàng
var create_contract = async (req, res, next) => {
    var id_product = req.body.product_id;
    var id_supplier = req.body.supplier_id;
    var name_product = req.body.product_name;
    console.log(id_product);
    console.log(id_supplier);
    var contracts = new contractSchema({ product_id: id_product, name_product: name_product, supplier_id: id_supplier, customer_id: req.session.userId, price: null, shipper_id: null, status: "0" })
    contracts.save().then(() => {
        console.log('insert contract success');

    })
    res.redirect('/customer');
}

// Chấp nhận báo giá
var accept_contract = (req, res, next) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, status: "1" }, function (err, doc) {
        if (doc == null) {
            res.redirect('/customer/manacontract');
        }
        else {
            doc.status = "2";
            doc.save().then(() => {
                console.log('Update contract status accept success')
            });

            res.redirect('/customer/manacontract');
            //res.redirect('/customer/create-payment/' + doc._id);
        }
    })
}

// Hủy đơn mua hàng
var cancel_contract = (req, res) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, $or: [{ 'status': "0" }, { 'status': "1" }] }, function (err, doc) {
        if (doc == null) {
            res.redirect('/customer/manacontract');
        }
        else {
            doc.status = "6";
            doc.save().then(() => {
                console.log('Update contract status Cancel success')
            });
            res.redirect('/customer/manacontract');
        }
    });
}

// Xác nhận nhận hàng
var done_contract = (req, res, next) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, status: "4" }, function (err, doc) {
        if (doc == null) {
            res.redirect('/customer/manacontract');
        }
        else {
            doc.status = "5";
            doc.save().then(() => {
                console.log('Update contract status done success')
            });

            res.redirect('/customer/manacontract');
        }
    })
}

module.exports = {
    create_contract,
    accept_contract,
    cancel_contract,
    done_contract,
}