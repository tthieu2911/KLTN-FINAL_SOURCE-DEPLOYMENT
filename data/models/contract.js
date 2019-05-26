var mongoose = require('mongoose')

var Schema = mongoose.Schema

var  contractSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'Products' },
    seller_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    buyer_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    shipper_id : { type: Schema.Types.ObjectId, ref: 'Users' },
    price : Number,
    currency: String,
    createBy: { type: Schema.Types.ObjectId, ref: 'Users' },
    createDate: Date,
    deleteBy: { type: Schema.Types.ObjectId, ref: 'Users' },
    deleteDate: Date,
    acceptDate: Date,
    shipDate: Date,
    receiveDate: Date,
    quatity: Number,
    status: String, // Đặt hàng: 0 -> Báo giá: 1 -> Chấp nhận: 2 -> Giao hàng: 3 -> Đang vận chuyển: 4 -> Đã nhận hàng: 5 -> Đã hủy: 6 
})
module.exports = mongoose.model('Contracts',contractSchema)
