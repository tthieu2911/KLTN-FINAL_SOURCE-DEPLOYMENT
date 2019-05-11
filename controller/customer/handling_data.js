var productSchema = require('../../data/models/product')
var contractSchema = require('../../data/models/contract')

// Tạo hợp đồng
var create_contract = async (req,res,next)=>{
    var id_product = req.body.product_id;
    var id_supplier = req.body.supplier_id;
    var name_product = req.body.product_name;
    console.log(id_product);
    console.log(id_supplier);
    var contracts = new contractSchema({product_id:id_product,name_product:name_product,supplier_id:id_supplier,customer_id:req.session.userId,price:null,shipper_id:null,status:"Đặt hàng"}) 
    contracts.save().then(()=>{
        console.log('insert contract success');
        
    })
    res.redirect('/customer'); 
}
//Chấp nhận đơn hàng
var accept_contract = (req,res,next)=>
{
    var id_contract =req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract,status:"Báo giá"}, function (err, doc){
        if (doc==null){
            res.redirect('/customer/manacontract'); 
        }
        else{
            doc.status ="Chấp nhận";
            doc.save().then(()=>{
                console.log('Update contract status accept success')
            });
          
         res.redirect('/customer/manacontract'); 
        }
})}
//Hủy đơn hàng
var cancel_contract = (req,res)=>
{
    var id_contract =req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract,$or:[{'status':"Đặt hàng"},{'status':"Báo giá"}]}, function (err, doc){
        if (doc==null){
            res.redirect('/customer/manacontract'); 
        }
        else{
        doc.status ="Hủy";
        doc.save().then(()=>{
            console.log('Update contract status Cancel success')
        });
        res.redirect('/customer/manacontract'); 
    }
      });
}
//Đã nhận hàng
var done_contract = (req,res,next)=>
{
    var id_contract =req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract,status:"Đang vận chuyển"}, function (err, doc){
        if (doc==null){
            res.redirect('/customer/manacontract'); 
        }
        else{
            doc.status ="Đã nhận hàng";
            doc.save().then(()=>{
                console.log('Update contract status done success')
            });
          
         res.redirect('/customer/manacontract'); 
        }
})}

module.exports ={
    create_contract,
    accept_contract,
    cancel_contract,
    done_contract,
   
   
}