var paypal = require('paypal-rest-sdk');
var request = require('request');

var PAYPAL_API = 'https://api.sandbox.paypal.com';

var contractSchema = require('../../data/models/contract');
var productSchema = require('../../data/models/product');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    // Id and Secret key of SHOP. Not buyer
    'client_id': 'ATSk5NM_ogJDrdCWRH8gVaBAQ4vDWnC_M5LBddOVtYwX92x3LCBW6UqtPc5XtTCmH0otJZxBN67nu7Zu',
    'client_secret': 'EFrFHxGEufNPiehpMkqB6j1XpNlOqWLgOpUoeKLfV7G6lDfR5mSDZGJSy4R36yyE0yrxAwZY1oSIZMJs'
});

// Tạo Payment Json
var create_payment_transaction = (req, res) => {
    var id_contract = req.params.id;
    console.log(id_contract);

    contractSchema.findOne({ _id: id_contract, status: "1" }, function (err, doc) {
        if (doc == null) {
            res.redirect('/customer/manacontract');
        }
        else {
            var id_product = doc.product_id;
            var payment_json = {};

            productSchema.findOne({ _id: id_product }, function (err, prod) {
                if (prod == null) {
                    res.redirect('/customer/manacontract');
                }
                else {

                    payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "/customer/execute-payment/" + prod._id,
                            "cancel_url": "/customer/manacontract"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": prod.name,
                                    "product_Id": prod._id,
                                    "price": doc.price,
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": doc.price
                            },
                            "description": prod.desription
                        }]
                    };

                    paypal.payment.create(payment_json, function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            /*for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === 'approval_url') {
                                    res.redirect(payment.links[i].href);
                                }
                            }*/
                            console.log(payment.links);
                        }
                    }); 
                }
            })
        }
    })
}

var execute_payment_transaction = (req, res) => {

    var id_contract = req.params.id;
    console.log(id_contract);

    contractSchema.findOne({ _id: id_contract, status: "1" }, function (err, doc) {
        if (doc == null) {
            res.redirect('/customer/manacontract');
        }
        else {
            const payerId = req.query.PayerID;
            const paymentId = req.query.paymentId;

            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": doc.price
                    }
                }]
            }

            request.post(PAYPAL_API + '/v1/payments/payment/' + paymentId +
                '/execute', execute_payment_json, function (err, response) {
                    if (err) {
                        console.error(err);
                        return res.sendStatus(500);
                    }
                    res.json(
                        {
                            status: 'success'
                        });
                    res.redirect('/customer/manacontract');
                })

            /*            paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                            if (error) {
                                console.log(error.response);
                                throw error;
                            } else {
                                doc.status = "2";
                                doc.save().then(() => {
                                    console.log('Update contract status accept success')
                                });
                                console.log(JSON.stringify(payment));
                                res.redirect('/customer/manacontract');
                            }
                        }); */
        }
    })
}

module.exports = {
    create_payment_transaction,
    execute_payment_transaction
}