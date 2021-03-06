var mongoose = require('mongoose')

var Schema = mongoose.Schema

var  warehouseSchema = new Schema({
    product_id:  { type: Schema.Types.ObjectId, ref: 'Products' },
    owner_id: { type: Schema.Types.ObjectId, ref: 'Users' }, //Nhà cung ứng available. Có thể là Supplier hoặc Manufacturer.
    warehouse_address: String,
    createDate: Date,
    updateDate: Date,
    quatity: Number
})
module.exports = mongoose.model('warehouses',warehouseSchema) 