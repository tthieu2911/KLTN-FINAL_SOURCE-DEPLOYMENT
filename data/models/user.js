var mongoose = require('mongoose')

var Schema = mongoose.Schema
 
var  userSchema = new Schema({
    username: {type:String,required: true},
    password: {type:String,required: true},
    fullName: {type:String},
    address: {type:String},
    phone: String,
    email: String,
    createDate: Date,
    updateDate: Date,
    type: {type:String}, //  manufacturer - supplier - retailer - customer - shipper
})

module.exports = mongoose.model('Users',userSchema)