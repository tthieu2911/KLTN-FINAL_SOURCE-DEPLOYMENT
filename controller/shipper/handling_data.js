var contractSchema = require('../../data/models/contract')

// Xử lí nhận đơn hàng
var admit_delivery = (req,res)=>{
    var id_contract =req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract }, function (err, doc){
        if (err) return err;
        doc.status ="4";
        doc.shipper_id = req.session.userId;
        doc.save().then(()=>{
            console.log('Update contract status transport success')
        });
      }); 
    res.redirect('/shipper'); 
}

//Trả hàng cho shipper khác giao
var cancel_delivery = (req,res)=>{
    var id_contract =req.params.id;
    console.log(id_contract);
    contractSchema.findOne({ _id: id_contract,status:'4'}, function (err, doc){
        if (doc==null){
            res.redirect('/shipper/manacontract'); 
        }
        else
        {
            doc.status ="3";
            doc.shipper_id = req.session.userId;
            doc.save().then(()=>{
                console.log('Update contract status transport success')
            });
        res.redirect('/shipper/manacontract'); 
        }
       
})}

module.exports = {
    admit_delivery,
    cancel_delivery,
}