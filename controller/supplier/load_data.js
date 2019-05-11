var contractSchema = require('../../data/models/contract')
var userSchema = require('./../../data/models/user')
var productSchema = require('../../data/models/product')
var user_load = require('../user/load_page');

// load dữ liệu cho trang index supplier
var load_contract = async(req,res,next)=>{
    await contractSchema.find({supplier_id:req.session.userId},(err,docs)=>{
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
        res.render('supplier/sl_index',{contracts:contractChunks, pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
    }).populate('customer_id product_id shipper_id')
    
}
// load dữ liệu product để mua
var load_product_to_buy = async(req,res,next)=>{
    await productSchema.find({supplier_id:{$ne:req.session.userId},del:true},(err,docs)=>{
        var productChunks =[];
        var chunkSize =1;
        for (var i=0; i<docs.length;i+= chunkSize){
            productChunks.push(docs.slice(i,i+chunkSize));
        }
        var page = parseInt(req.query.page) ||1;
        var perPage = 5;
        var start = (page -1)*perPage;
        var end = page*perPage;
        var num_page= Math.ceil(docs.length/perPage)
        productChunks= productChunks.slice(start,end)
        res.render('supplier/pages/sl_buy_product',{products:productChunks,pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
    }).populate('supplier_id')
}

// load dữ liệu product của supplier đang đăng nhập
var load_product = async(req,res,next)=>{
    await productSchema.find({supplier_id:req.session.userId,del:true},(err,docs)=>{
        var productChunks =[];
        var chunkSize=1;
        for (var i=0; i<docs.length;i+= chunkSize){
            productChunks.push(docs.slice(i,i+chunkSize));
        }
        var page = parseInt(req.query.page) ||1;
        var perPage = 5;
        var start = (page -1)*perPage;
        var end = page*perPage;
        var num_page= Math.ceil(docs.length/perPage)
        productChunks= productChunks.slice(start,end)
        res.render('supplier/pages/sl_list_product',{products:productChunks, pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
    }).populate('supplier_id')
}

// load dữ liệu cho trang báo giá giá sản phẩm
var load_price = async (req,res)=>{
    var id = req.params.id;
    contractSchema.find({ _id: id,status:'Đặt hàng' }, async (err, doc)=>{
        if (doc==null){
            res.redirect('/supplier'); 
        }
        else{
            await contractSchema.find({'_id':id},(err,docs)=>{
                var contractChunks =[];
                var chunkSize =3;
                for (var i=0; i<docs.length;i+= chunkSize){
                    contractChunks.push(docs.slice(i,i+chunkSize));
                }
                res.render('supplier/pages/sl_send_price',{contracts:contractChunks});
            }).populate('product_id customer_id')
        }})
}
// load dữ liệu supplier
var load_profile = async(req,res,next)=>{
    await userSchema.find({_id:req.session.userId},async(err,docs)=>{
        var userChunks =[];
        var chunkSize =1; 
        for (var i=0; i<docs.length;i+= chunkSize){
            userChunks.push(docs.slice(i,i+chunkSize));
        }
        await contractSchema.find({supplier_id:req.session.userId},(err,docs)=>{
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
        res.render('supplier/pages/sl_profile',{contracts:contractChunks,users:userChunks,success:req.flash('success'),message:req.flash('message'), pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
    }).populate('product_id')
    
})}
//Load dữ liệu theo dõi tình trạng đơn hàng đã đặt
var load_contract_manager = async(req,res,next)=>{
    await contractSchema.find({ customer_id:req.session.userId,$or:[{'status':"Đặt hàng"},{'status':"Báo giá"},{'status':"Chấp nhận"}, {'status':"Hủy"},{'status':'Giao hàng'},{'status':'Đang vận chuyển'}]},(err,docs)=>{
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
        res.render('supplier/pages/sl_contract',{contracts:contractChunks,pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
    }).populate('product_id shipper_id')
}
// load chi tiết đơn hàng đã được tạo bởi customer
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
        res.render('supplier/pages/sl_detail',{contracts:contractChunks});
    }).populate('product_id shipper_id customer_id supplier_id')
}
// load chi tiết đơn hàng đã mua từ supplier khác
var load_detail_contract_supplier = async (req,res,next)=>
{
    var id_contract =req.params.id;
    console.log(id_contract);
    await contractSchema.find({_id:id_contract},(err,docs)=>{
        var contractChunks =[];
        var chunkSize =3;
        for (var i=0; i<docs.length;i+= chunkSize){
            contractChunks.push(docs.slice(i,i+chunkSize));
        }
        res.render('supplier/pages/sl_detail',{contracts:contractChunks});
    }).populate('product_id shipper_id customer_id supplier_id')
}
// load dữ liệu cho trang update sản phẩm
var load_update_product = async (req,res)=>{
    var id = req.params.id;
    productSchema.find({ _id: id}, async (err, docs)=>{
        if (docs==null){
            res.redirect('/supplier'); 
        }
        else{
            var productChunks =[]; 
            var chunkSize =3; 
            for (var i=0; i<docs.length;i+= chunkSize){
                productChunks.push(docs.slice(i,i+chunkSize));
            }
            res.render('supplier/pages/sl_edit_product',{products:productChunks}); 
        }})
}
module.exports ={
    load_contract,
    load_product_to_buy,
    load_product,
    load_price,
    load_profile,
    load_contract_manager,
    load_detail_contract,
    load_detail_contract_supplier,
    load_update_product,
}