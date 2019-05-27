var contractSchema = require('../../data/models/contract')
var userSchema = require('./../../data/models/user')
var productSchema = require('../../data/models/product')
var wareHouseSchema = require('../../data/models/warehouse')
var user_load = require('../user/load_page');

// Danh sách đơn bán hàng
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
        res.render('supplier/sl_index',{contracts:contractChunks, pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
    }).sort({ status: -1 }).populate('buyer_id product_id shipper_id')
}

// load dữ liệu sản phẩm để mua
var load_product_to_buy = async(req,res,next)=>{
    wareHouseSchema.find({quatity:{$ne:0}}, async (error,product)=>{
        if (product==null){
            res.redirect('/supplier/pages/sl_buy_product'); 
        }
        else{
            await productSchema.find({manufacturer_id:product.supplier_id,_id:product.product_id},(err,docs)=>{
                var productChunks =[];
                var chunkSize =1;
                for (var i=0; i<docs.length;i+= chunkSize){
                    productChunks.push(docs.slice(i,i+chunkSize));
                }
                productChunks= productChunks.slice(start,end)

                var page = parseInt(req.query.page) || 1;
                var perPage = 6;
                var start = (page -1)*perPage;
                var end = page*perPage;
                var num_page= Math.ceil(docs.length/perPage)

                res.render('supplier/pages/sl_buy_product',{products:productChunks, pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
            }).sort({ name: -1 }).populate('manufacturer_id')
        }
    })
}

// load danh sách sản phẩm của supplier đang đăng nhập
var load_product = async(req,res,next)=>{
    wareHouseSchema.find({supplier_id:req.session.userId}, async (error,product)=>{
        if (product==null){
            res.redirect('/supplier/pages/sl_list_product'); 
        }
        else{
            await productSchema.find({_id:product.product_id},(err,docs)=>{
                var productChunks =[];
                var chunkSize =1;
                for (var i=0; i<docs.length;i+= chunkSize){
                    productChunks.push(docs.slice(i,i+chunkSize));
                }
                productChunks= productChunks.slice(start,end)

                var warehouseChunks =[];
                var chunkSize =1;
                for (var i=0; i<product.length;i+= chunkSize){
                    warehouseChunks.push(product.slice(i,i+chunkSize));
                }
                warehouseChunks= warehouseChunks.slice(start,end)

                var page = parseInt(req.query.page) || 1;
                var perPage = 6;
                var start = (page -1)*perPage;
                var end = page*perPage;
                var num_page= Math.ceil(docs.length/perPage)

                res.render('supplier/pages/sl_list_product',{products:productChunks, wareHouse:warehouseChunks, pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
            }).sort({ name: -1 }).populate('manufacturer_id supplier')
        }
    })
}

// load trang báo giá sản phẩm
var load_price = async (req,res)=>{
    var id = req.params.id;
    contractSchema.find({ _id: id,status:'0' }, async (err, doc)=>{
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
            }).populate('product_id buyer_id')
        }})
}

// load thông tin tài khoản supplier
var load_profile = async(req,res,next)=>{
    await userSchema.find({_id:req.session.userId},async(err,docs)=>{
        var userChunks =[];
        var chunkSize =1; 
        for (var i=0; i<docs.length;i+= chunkSize){
            userChunks.push(docs.slice(i,i+chunkSize));
        }
        await contractSchema.find({buyer_id:req.session.userId,  status: "5"},(err,docs)=>{
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
    }).sort({ status: -1 }).populate('product_id shipper_id seller_id')
})}

//Load dữ liệu theo dõi tình trạng đơn mua hàng
var load_contract_manager = async(req,res,next)=>{
    await contractSchema.find({buyer_id:req.session.userId,$or:[{'status':"0"},{'status':"1"},{'status':"2"}, {'status':"6"},{'status':'3'},{'status':'4'}]},(err,docs)=>{
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
    }).sort({ status: -1 }).populate('product_id shipper_id seller_id')
}

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
        res.render('supplier/pages/sl_detail',{contracts:contractChunks});
    }).populate('product_id shipper_id buyer_id seller_id')
}

// load chi tiết đơn mua hàng
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
    }).populate('product_id shipper_id buyer_id seller_id')
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
}