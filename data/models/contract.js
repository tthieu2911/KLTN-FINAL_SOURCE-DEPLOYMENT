var mongoose = require('mongoose')

var Schema = mongoose.Schema

var  contractSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'Products' },
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    price : Number,
    shipper_id : { type: Schema.Types.ObjectId, ref: 'Users' },
    status: String, // Đặt hàng -> Báo giá-> Chấp nhận-> Giao hàng-> Đang Vận chuyển-> Đã nhận hàng-> Đã hủy 
})
module.exports = mongoose.model('Contracts',contractSchema)
