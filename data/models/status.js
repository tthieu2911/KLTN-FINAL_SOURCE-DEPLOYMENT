var mongoose = require('mongoose')

var Schema = mongoose.Schema

var  statusChema = new Schema({
    _id :Number,
    name: {type:String,required: true},
    
})
module.exports = mongoose.model('Status',statusChema) 