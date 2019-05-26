var contractSchema = require('../../data/models/contract')
var userSchema = require('./../../data/models/user')
var productSchema = require('../../data/models/product')
var wareHouseSchema = require('../../data/models/warehouse')
var user_load = require('../user/load_page');

// load dữ liệu cho trang index supplier
var load_contract = async(req,res,next)=>{
    await contractSchema.find({seller_id:req.session.userId},(err,docs)=>{
        var contractChunks =[];
        var chunkSize =1;
        for (var i=0; i<docs.length;i+= chunkSize){
            contractChunks.push(docs.slice(i,i+chunkSize));
        }
        var page = parseInt(req.query.page) ||1;
        var perPage = 5;
        var start = (page -1)*perPage;
        var end = page*perPage;
        var num_page= Math.ceil(docs.length/perPage)
        contractChunks= contractChunks.slice(start,end)
        res.render('manufacturer/mf_index',{contracts:contractChunks, pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
    }).sort({ status: -1 }).populate('buyer_id product_id shipper_id')
}

// load dữ liệu sản phẩm của manufacturer đang đăng nhập
var load_product = async(req,res,next)=>{
    wareHouseSchema.find({supplier_id:req.session.userId}, async (error,product)=>{
        if (product==null){
            res.redirect('/manufacturer/pages/mf_list_product'); 
        }
        else{
            await productSchema.find({_id:product.product_id},(err,docs)=>{
                var productChunks =[];
                var chunkSize =1;
                for (var i=0; i<docs.length;i+= chunkSize){
                    productChunks.push(docs.slice(i,i+chunkSize));
                }
                var page = parseInt(req.query.page) || 1;
                var perPage = 6;
                var start = (page -1)*perPage;
                var end = page*perPage;
                var num_page= Math.ceil(docs.length/perPage)
                productChunks= productChunks.slice(start,end)
                res.render('manufacturer/pages/mf_list_product',{products:productChunks,pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
            }).sort({ name: -1 }).populate('manufacturer_id')
        }
    })
}

// load dữ liệu báo giá sản phẩm
var load_price = async (req,res)=>{
    var id = req.params.id;
    contractSchema.find({ _id: id,status:'0' }, async (err, doc)=>{
        if (doc==null){
            res.redirect('/manufacturer'); 
        }
        else{
            await contractSchema.find({'_id':id},(err,docs)=>{
                var contractChunks =[];
                var chunkSize =3;
                for (var i=0; i<docs.length;i+= chunkSize){
                    contractChunks.push(docs.slice(i,i+chunkSize));
                }
                res.render('manufacturer/pages/mf_send_price',{contracts:contractChunks});
            }).populate('product_id buyer_id')
        }})
}

// load dữ liệu manufacturer
var load_profile = async(req,res,next)=>{
    await userSchema.find({_id:req.session.userId},async(err,docs)=>{
        var userChunks =[];
        var chunkSize =1; 
        for (var i=0; i<docs.length;i+= chunkSize){
            userChunks.push(docs.slice(i,i+chunkSize));
        }
        await contractSchema.find({seller_id:req.session.userId},(err,docs)=>{
            var contractChunks =[];
            var chunkSize =1;
            for (var i=0; i<docs.length;i+= chunkSize){
                contractChunks.push(docs.slice(i,i+chunkSize));
            }
            var page = parseInt(req.query.page) ||1;
            var perPage = 5;
            var start = (page -1)*perPage;
            var end = page*perPage;
            var num_page= Math.ceil(docs.length/perPage)
            contractChunks= contractChunks.slice(start,end)   
        res.render('manufacturer/pages/mf_profile',{contracts:contractChunks,users:userChunks,success:req.flash('success'),message:req.flash('message'), pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
    }).sort({ status: -1 }).populate('product_id shipper_id seller_id buyer_id') 
})}

// load chi tiết đơn bán hàng
var load_detail_contract = async (req,res,next)=>
{
    var id_contract =req.params.id;
    console.log(id_contract);
    await contractSchema.find({_id:id_contract},(err,docs)=>{
        var contractChunks =[];
        var chunkSize =3;
        for (var i=0; i<docs.length;i+= chunkSize){
            contractChunks.push(docs.slice(i,i+chunkSize));
        }
        res.render('manufacturer/pages/mf_detail',{contracts:contractChunks});
    }).populate('product_id shipper_id buyer_id seller_id')
}

// load thông tin sản phẩm để chỉnh sửa
var load_update_product = async (req,res)=>{
    var id = req.params.id;
    productSchema.find({ _id: id}, async (err, docs)=>{
        if (docs==null){
            res.redirect('/manufacturer'); 
        }
        else{
            var productChunks =[]; 
            var chunkSize =3; 
            for (var i=0; i<docs.length;i+= chunkSize){
                productChunks.push(docs.slice(i,i+chunkSize));
            }
            res.render('manufacturer/pages/mf_edit_product',{products:productChunks}); 
        }})
}

module.exports ={
    load_contract,
    load_price,
    load_product,
    load_update_product,
    load_profile,
    load_detail_contract,
}