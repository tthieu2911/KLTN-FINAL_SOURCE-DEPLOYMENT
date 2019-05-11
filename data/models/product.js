var mongoose = require('mongoose')

var Schema = mongoose.Schema

var  productSchema = new Schema({
    name: {type:String,required: true},
    desription :{type:String, required:true},
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    del:Boolean,
})

module.exports = mongoose.model('Products',productSchema)