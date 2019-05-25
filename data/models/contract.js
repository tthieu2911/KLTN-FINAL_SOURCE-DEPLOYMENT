var mongoose = require('mongoose')

var Schema = mongoose.Schema

var  contractSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'Products' },
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    price : Number,
    shipper_id : { type: Schema.Types.ObjectId, ref: 'Users' },
    status: String, // Đặt hàng: 0 -> Báo giá: 1 -> Chấp nhận: 2 -> Giao hàng: 3 -> Đang vận chuyển: 4 -> Đã nhận hàng: 5 -> Đã hủy: 6 
})
module.exports = mongoose.model('Contracts',contractSchema)
