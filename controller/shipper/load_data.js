var contractSchema = require('../../data/models/contract')
var userSchema = require('../../data/models/user')
var user_load = require('../user/load_page');

//load đơn hàng đang cần giao
var load_contract = async(req,res,next)=>{
    await contractSchema.find({status:'Giao hàng'},(err,docs)=>{
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
        res.render('shipper/sp_index',{contracts:contractChunks, pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
    }).populate('product_id customer_id supplier_id')
}
//load chi tiết đơn hàng
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
        res.render('shipper/pages/sp_detail',{contracts:contractChunks});
    }).populate('product_id shipper_id customer_id supplier_id')
}
//load đơn hàng đã nhận 
var load_contract_manager = async(req,res,next)=>{
    await contractSchema.find({shipper_id:req.session.userId,status:"Đang vận chuyển"},(err,docs)=>{
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
        res.render('shipper/pages/sp_contract',{contracts:contractChunks,pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
    }).populate('product_id customer_id supplier_id')
}
// load dữ liệu trang cá nhân
var load_profile = async(req,res,next)=>{
    await userSchema.find({_id:req.session.userId},async(err,docs)=>{
        var userChunks =[];
        var chunkSize =1;
        for (var i=0; i<docs.length;i+= chunkSize){
            userChunks.push(docs.slice(i,i+chunkSize));
        }
        await contractSchema.find({shipper_id:req.session.userId},(err,docs)=>{
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
        res.render('shipper/pages/sp_profile',{contracts:contractChunks,users:userChunks,success:req.flash('success'),message:req.flash('message'),pagination: { page: page, limit:num_page},paginateHelper: user_load.createPagination});
    }).populate('product_id')
    
})}

module.exports = {
    load_contract,
    load_profile,
    load_contract_manager,
    load_detail_contract,
}