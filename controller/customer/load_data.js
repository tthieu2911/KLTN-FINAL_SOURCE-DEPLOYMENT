var productSchema = require('../../data/models/product')
var contractSchema = require('../../data/models/contract')
var userSchema = require('../../data/models/user')
// paging

var user_load = require('../user/load_page');



// Load sản phẩm của index
var load_product = async(req,res,next)=>{
    await productSchema.find({del:true},(err,docs)=>{
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
        res.render('customer/ctm_index',{products:productChunks,pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
    }).populate('supplier_id')
}
// Load dữ liệu thông tin customer
var load_profile = async(req,res,next)=>{
    await userSchema.find({_id:req.session.userId},async(err,docs)=>{
        var userChunks =[];
        var chunkSize =3;
        for (var i=0; i<docs.length;i+= chunkSize){
            userChunks.push(docs.slice(i,i+chunkSize)); 
        }
        await contractSchema.find({customer_id:req.session.userId,status:"Đã nhận hàng"},(err,docs)=>{
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
        res.render('customer/pages/ctm_profile',{contract:contractChunks,users:userChunks,success:req.flash('success'),message:req.flash('message'), pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
    }).populate('product_id shipper_id supplier_id')
    
})}
// Quản lí trình trạng đơn hàng
var load_contract_manager = async(req,res,next)=>{
    var page = parseInt(req.query.page) ||1;
    var perPage = 5;
    var start = (page -1)*perPage;
    var end = page*perPage;
    await contractSchema.find({customer_id:req.session.userId,$or:[{'status':"Đặt hàng"},{'status':"Báo giá"},{'status':"Chấp nhận"}, {'status':"Hủy"},{'status':'Giao hàng'},{'status':'Đang vận chuyển'}]},async (err,docs)=>{
        var contractChunks =[];
        var chunkSize =1;
        for (var i=0; i<docs.length;i+= chunkSize){
            contractChunks.push(docs.slice(i,i+chunkSize));
        }
        var num_page= Math.ceil(docs.length/perPage)
        contractChunks= contractChunks.slice(start,end)
        res.render('customer/pages/ctm_contract',{contracts:contractChunks, pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
}).populate('product_id shipper_id')
   
}
// load chi tiết đơn hàng
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
        res.render('customer/pages/ctm_detail',{contracts:contractChunks});
    }).populate('product_id shipper_id customer_id supplier_id')
}
 
module.exports = { 
    load_product,
    load_profile,
    load_contract_manager,
    load_detail_contract,
}