var contractSchema = require('../../data/models/contract');
var Messages = require('./../../data/messages.json');

var today = new Date();

// Xử lí giao hàng
var admit_delivery = (req, res) => {
    var id_contract = req.params.id;
    contractSchema.findOne({ _id: id_contract, status: '5' }, function (err, doc) {
        if (doc == null || doc.length == 0) {
            console.log('Received to deliver failed. Can not find contract.');
            req.flash('message', Messages.contract.ship_notFound);
            res.redirect('/shipper/manacontract');
        }
        else {
            doc.status = '6';
            doc.shipper_id = req.session.userId;
            doc.shipDate = today;
            doc.save().then(() => {
                console.log('Received to deliver successfully.');
                req.flash('success', Messages.contract.receive_to_ship.success);
                res.redirect('/shipper/manacontract');
            });
        }
    });
}

//Trả hàng cho shipper khác giao
var cancel_delivery = (req, res) => {
    var id_contract = req.params.id;
    contractSchema.findOne({ _id: id_contract, status: '4' }, function (err, doc) {
        if (doc == null || doc.length == 0) {
            console.log('Cancel delivery failed. Can not find contract.');
            req.flash('success', Messages.contract.ship_notFound);
            res.redirect('/shipper/manacontract');
        }
        else {
            doc.status = '3';
            doc.shipper_id = "";
            doc.shipDate = "";
            doc.save().then(() => {
                console.log('Cancel delivery successfully');
                req.flash('success', Messages.contract.deny_to_ship.success);
                res.redirect('/shipper/manacontract');
            });
        }
    })
}

// Báo giá 
var send_price = async (req, res, next) => {
    var id_contract = req.body.contract_id;
    var price = req.body.ship_price;

    contractSchema.findOne({ _id: id_contract, status: '3' }, (err, doc) => {
        if (doc == null || doc.length == 0) {
            console.log('Send price failed. Can not find contract.');
            req.flash('message', Messages.contract.sell_notFound);
            res.redirect('/shipper');
        }
        else {
            doc.shipPrice = price;
            doc.status = '4';
            doc.shipper_id = req.session.userId;
            doc.save().then(() => {
                console.log('Send price successfully.');
                req.flash('success', Messages.contract.send_price.success);
                res.redirect('/shipper');
            });
        }
    })
}

module.exports = {
    admit_delivery,
    cancel_delivery,
    send_price
}