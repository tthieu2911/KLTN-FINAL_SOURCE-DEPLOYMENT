var mongoose = require('mongoose')

var Schema = mongoose.Schema

var  productSchema = new Schema({
    name: {type:String,required: true},
    desription :{type:String, required:true},
    manufacturer_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    createDate: Date,
    expireDate: Date,
    updateDate: Date
})

module.exports = mongoose.model('Products',productSchema)