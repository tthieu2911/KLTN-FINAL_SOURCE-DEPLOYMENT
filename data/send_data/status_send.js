var statuSchema = require('../models/status')
var mongoose = require('mongoose')
var DBurl = require('./../config')
mongoose.connect(DBurl.url)
var status =[
    new statuSchema({
        _id:1,
        name:'0',
        
    }),
    new statuSchema({
        _id:2,
        name:'1',
        
    }),
    new statuSchema({
        _id:3,
        name:'Xác nhận mua',
        
    }),
    new statuSchema({
        _id:4,
        name:'Lập đơn hàng',
        
    }),
    new statuSchema({
        _id:5,
        name:'3',
        
    }),
    new statuSchema({
        _id:6,
        name:'Thành công',
        
    }),
    new statuSchema({
        _id:7,
        name:'6',
        
    })
    
];
var done = 0;
for(var i =0 ;i<status.length;i++){
    status[i].save(function(err,result){
        done ++;
        if(done === status.length){
            mongoose.disconnect();
        }
    });
}
