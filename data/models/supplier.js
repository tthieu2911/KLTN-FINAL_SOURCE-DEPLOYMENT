var mongoose = require('mongoose')

var Schema = mongoose.Schema

var  supplierSchema = new Schema({
    product_id: {type:String,required: true},
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    del:Boolean,
})
module.exports = mongoose.model('Suppliers',supplierSchema) 