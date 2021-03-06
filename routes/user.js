var express = require('express');
var app = express.Router();
var csrf = require('csurf');
var load_page = require('./../controller/user/load_page');
var handling = require('./../controller/user/handling_user');
var csrfProtection = csrf();
// app.use(csrfProtection); 

// Administrator
var ad_load_data = require('../controller/admin/load_data');
var ad_handling = require('../controller/admin/handling_data');
app.use('/admin',load_page.requiresLogin);
app.get('/admin',ad_load_data.load_user);
app.get('/admin/create_user', (req, res) => {
    res.render('../views/admin/ad_create_user',{success: req.flash('success'), message: req.flash('message')});
});
app.post('/admin/create_user',ad_handling.create_user);
app.get('/admin/edit_user/:id',ad_load_data.load_edit_user);
app.post('/admin/edit_user/:id',ad_handling.edit_user);
app.get('/admin/delete_user/:id',ad_handling.delete_user);


// Custommer
var ctm_load_data = require('../controller/customer/load_data');
var ctm_handling = require('../controller/customer/handling_data');
app.use('/customer',load_page.requiresLogin);
app.get('/customer',ctm_load_data.load_product);

app.post('/customer/create_contract', ctm_load_data.load_contract_to_buy);
app.post('/customer/create_contract/done',ctm_handling.create_contract);
app.get('/customer/accept/:id',ctm_handling.accept_contract);
app.get('/customer/cancel/:id',ctm_handling.cancel_contract);
app.get('/customer/done/:id',ctm_handling.done_contract);

app.get('/customer/manacontract',ctm_load_data.load_contract_manager);
app.get('/customer/detail/:id',ctm_load_data.load_detail_contract);
app.get('/customer/profile',ctm_load_data.load_profile);

// Manufacturer
var mf_load_data = require('../controller/manufacturer/load_data');
var mf_handling = require('../controller/manufacturer/handling_data');
//- Sell
app.use('/manufacturer',load_page.requiresLogin);
app.get('/manufacturer',mf_load_data.load_contract);
app.get("/manufacturer/contract/:id",mf_load_data.load_price);
app.post("/manufacturer/price",mf_handling.send_price);         // Send price
app.get("/manufacturer/contract/delivery/accept/:id",mf_handling.accept_ship_price);
app.get("/manufacturer/contract/delivery/cancel/:id",mf_handling.cancel_ship_price);
app.get("/manufacturer/contract/delivery/:id",mf_handling.delivery_contract);
app.get("/manufacturer/contract/delete/:id",mf_handling.delete_contract);
//- Warehouse
app.get('/manufacturer/product',mf_load_data.load_product);
app.get('/manufacturer/product/create_product', (req, res) => {
    res.render('../views/manufacturer/pages/mf_create_product',{success: req.flash('success'), message: req.flash('message')});
});
app.post('/manufacturer/create_product',mf_handling.create_product);
app.get('/manufacturer/product/delete/:id',mf_handling.delete_product);
app.get('/manufacturer/product/edit/:id',mf_load_data.load_update_product);
app.post('/manufacturer/product/edit',mf_handling.edit_product);     // Edit Product
//- Profile
app.get('/manufacturer/profile',mf_load_data.load_profile);
app.get('/manufacturer/detail/:id',mf_load_data.load_detail_contract);


// Retailer
var rt_load_data = require('../controller/retailer/load_data');
var rt_handling = require('../controller/retailer/handling_data');
//- Sell
app.use('/retailer',load_page.requiresLogin);
app.get('/retailer',rt_load_data.load_contract);
app.get("/retailer/contract/:id",rt_load_data.load_price);
app.post("/retailer/price",rt_handling.send_price);         // Send price
app.get("/retailer/contract/delivery/:id",rt_handling.delivery_contract);
app.get("/retailer/contract/delivery/accept/:id",rt_handling.accept_ship_price);
app.get("/retailer/contract/delivery/cancel/:id",rt_handling.cancel_ship_price);
app.get("/retailer/contract/delete/:id",rt_handling.delete_contract);
//- Warehouse
app.get('/retailer/product',rt_load_data.load_product);
app.get('/retailer/product/delete/:id',rt_handling.delete_product);
//- Buy
app.get('/retailer/market',rt_load_data.load_product_to_buy);
app.post('/retailer/market/create_contract',rt_load_data.load_contract_to_buy);
app.post('/retailer/contract/buy',rt_handling.create_contract);
app.get('/retailer/manacontract',rt_load_data.load_contract_manager);
app.get('/retailer/cancel/:id',rt_handling.cancel_contract);
app.get('/retailer/accept/:id',rt_handling.accept_contract);
app.get('/retailer/done/:id',rt_handling.done_contract);
//- Profile
app.get('/retailer/profile',rt_load_data.load_profile);
app.get('/retailer/detail/:id',rt_load_data.load_detail_contract);
//- Product
app.get('/retailer/product/edit/:id',rt_load_data.load_update_product);
app.post('/retailer/product/edit',rt_handling.edit_product);


// Supplier
var sl_load_data = require('../controller/supplier/load_data');
var sl_handling = require('../controller/supplier/handling_data');
//- Sell
app.use('/supplier',load_page.requiresLogin);
app.get('/supplier',sl_load_data.load_contract);
app.get("/supplier/contract/:id",sl_load_data.load_price);
app.post("/supplier/price",sl_handling.send_price);         // Send price
app.get("/supplier/contract/delivery/:id",sl_handling.delivery_contract);
app.get("/supplier/contract/delivery/accept/:id",sl_handling.accept_ship_price);
app.get("/supplier/contract/delivery/cancel/:id",sl_handling.cancel_ship_price);
app.get("/supplier/contract/delete/:id",sl_handling.delete_contract);
//- Warehouse
app.get('/supplier/product',sl_load_data.load_product);
app.get('/supplier/product/delete/:id',sl_handling.delete_product);
//- Buy
app.get('/supplier/market',sl_load_data.load_product_to_buy);
app.post('/supplier/market/create_contract',sl_load_data.load_contract_to_buy);
app.post('/supplier/contract/buy',sl_handling.create_contract);
app.get('/supplier/manacontract',sl_load_data.load_contract_manager);
app.get('/supplier/cancel/:id',sl_handling.cancel_contract);
app.get('/supplier/accept/:id',sl_handling.accept_contract);
app.get('/supplier/done/:id',sl_handling.done_contract);
//- Profile
app.get('/supplier/profile',sl_load_data.load_profile);
app.get('/supplier/detail/:id',sl_load_data.load_detail_contract);
//- Product
app.get('/supplier/product/edit/:id',sl_load_data.load_update_product);
app.post('/supplier/product/edit',sl_handling.edit_product);

// Shipper
var sp_load_data = require('../controller/shipper/load_data');
var sp_handling = require('../controller/shipper/handling_data');
//- Ship
app.use('/shipper',load_page.requiresLogin);
app.get('/shipper',sp_load_data.load_contract);
app.get('/shipper/contract/:id',sp_load_data.load_shipPrice);
app.post('/shipper/price',sp_handling.send_price);      
app.get('/shipper/delivery/:id',sp_handling.admit_delivery);
//- Manage
app.get('/shipper/manacontract',sp_load_data.load_contract_manager);
app.get('/shipper/cancel/:id',sp_handling.cancel_delivery);
app.get('/shipper/detail/:id',sp_load_data.load_detail_contract);
//- Profile
app.get('/shipper/profile',sp_load_data.load_profile);

module.exports = app;