var express = require('express');
var app = express.Router();
var csrf = require('csurf')
var load_page = require('./../controller/user/load_page');
var handling = require('./../controller/user/handling_user')
var csrfProtection = csrf();
// app.use(csrfProtection); 
//Custommer
var ctm_load_data = require('../controller/customer/load_data')
var ctm_handling = require('../controller/customer/handling_data')
app.use('/customer',load_page.requiresLoginCustom)
app.get('/customer',ctm_load_data.load_product)
app.post('/customer/contract',ctm_handling.create_contract)
app.get('/customer/accept/:id',ctm_handling.accept_contract)
app.get('/customer/cancel/:id',ctm_handling.cancel_contract)
app.get('/customer/done/:id',ctm_handling.done_contract)
app.get('/customer/detail/:id',ctm_load_data.load_detail_contract)
app.get('/customer/profile',ctm_load_data.load_profile)
app.get('/customer/manacontract',ctm_load_data.load_contract_manager)
//Supplier
var sl_load_data = require('../controller/supplier/load_data')
var sl_handling = require('../controller/supplier/handling_data')
app.use('/supplier',load_page.requiresLoginSupplier)
app.get('/supplier',sl_load_data.load_contract)
app.get('/supplier/product',sl_load_data.load_product)
app.post('/supplier/product',sl_handling.create_product)
app.get('/supplier/product/delete/:id',sl_handling.delete_product)
app.get('/supplier/market',sl_load_data.load_product_to_buy)
app.get("/supplier/contract/:id",sl_load_data.load_price);
app.get("/supplier/contract/delivery/:id",sl_handling.delivery_contract);
app.get("/supplier/contract/delete/:id",sl_handling.delete_contract);
app.post("/supplier/price",sl_handling.send_price);
app.post('/supplier/contract/buy',sl_handling.create_contract_supplier)

app.get('/supplier/profile',sl_load_data.load_profile)
app.get('/supplier/manacontract',sl_load_data.load_contract_manager)
// app.get('/supplier/manacontract/cancel/:id',)
// app.get('/supplier/manacontract/done/:id',)
// app.get('/supplier/manacontract/detail/:id',)
// app.get('/supplier/manacontract/accept/:id',)
app.get('/supplier/cancel/:id',sl_handling.cancel_contract_sl)
app.get('/supplier/accept/:id',sl_handling.accept_contract)
app.get('/supplier/done/:id',sl_handling.done_contract)
app.get('/supplier/detail/:id',sl_load_data.load_detail_contract)
app.get('/supplier/product/edit/:id',sl_load_data.load_update_product)
app.post('/supplier/product/edit',sl_handling.edit_product)
//Shipper
var sp_load_data = require('../controller/shipper/load_data')
var sp_handling = require('../controller/shipper/handling_data')
app.use('/shipper',load_page.requiresLoginShipper)
app.get('/shipper',sp_load_data.load_contract)
app.get('/shipper/delivery/:id',sp_handling.admit_delivery)
app.get('/shipper/profile',sp_load_data.load_profile)
app.get('/shipper/cancel/:id',sp_handling.cancel_delivery)
app.get('/shipper/detail/:id',sp_load_data.load_detail_contract)
app.get('/shipper/manacontract',sp_load_data.load_contract_manager)

module.exports = app;