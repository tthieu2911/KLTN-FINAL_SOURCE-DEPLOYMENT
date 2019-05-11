var mongoose = require('mongoose')

var Schema = mongoose.Schema
 
var  userSchema = new Schema({
    username: {type:String,required: true},
    password: {type:String,required: true},
    fullName: {type:String},
    address: {type:String},
    phone: String,
    email: String,
    type: {type:String}, // customer - supplier - shipper - admin
    del:Boolean,
})

module.exports = mongoose.model('Users',userSchema)