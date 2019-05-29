var mongoose = require('mongoose')

var Schema = mongoose.Schema

var  contractSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'Products' },
    seller_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    buyer_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    shipper_id : { type: Schema.Types.ObjectId, ref: 'Users' },
    price : Number,
    shipPrice: Number,
    currency: String,
    shipFrom: String,
    shipTo: String,
    createBy: { type: Schema.Types.ObjectId, ref: 'Users' },
    createDate: Date,
    deleteBy: { type: Schema.Types.ObjectId, ref: 'Users' },
    deleteDate: Date,
    acceptDate: Date,
    shipDate: Date,
    receiveDate: Date,
    quatity: Number,
    status: String, 

    // Đặt hàng: 0 
    // Báo giá: 1 
    // Chấp nhận báo giá: 2 
    // Cho phép giao hàng: 3 
    // Báo giá giao hàng: 4 
    // Chấp nhận báo giá giao hàng: 5
    // Đang vận chuyển: 6 
    // Đã nhận hàng: 7 
    // Đã hủy: 8 
})
module.exports = mongoose.model('Contracts',contractSchema)
