var contractSchema = require('../../data/models/contract');

var today = new Date();

// Xử lí nhận đơn hàng
var admit_delivery = (req, res) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract }, function (err, doc) {
        if (doc == null || doc.length == 0) {
            console.log('Received to deliver failed. Can not find contract.');
        }
        else {
            doc.status = "4";
            doc.shipper_id = req.session.userId;
            doc.shipDate = today;
            doc.save().then(() => {
                console.log('Received to deliver successfully.');
            });
        }
    });
    res.redirect('/shipper');
}

//Trả hàng cho shipper khác giao
var cancel_delivery = (req, res) => {
    var id_contract = req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract, status: '4' }, function (err, doc) {
        if (doc == null || doc.length == 0) {
            console.log('Cancel delivery failed. Can not find contract.');
        }
        else {
            doc.status = "3";
            doc.shipper_id = null;
            doc.shipDate = null;
            doc.save().then(() => {
                console.log('Cancel delivery successfully');
            });
        }
        res.redirect('/shipper/manacontract');
    })
}

module.exports = {
    admit_delivery,
    cancel_delivery,
}