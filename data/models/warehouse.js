var mongoose = require('mongoose')

var Schema = mongoose.Schema

var  wareHouseSchema = new Schema({
    product_id: {type:String,required: true},
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Users' }, //Nhà cung ứng available. Có thể là Supplier hoặc Manufacturer.
    quatity: Number
})
module.exports = mongoose.model('wareHouse',wareHouseSchema) 