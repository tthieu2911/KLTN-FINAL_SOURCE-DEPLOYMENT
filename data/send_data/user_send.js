var user = require('../models/user')
var mongoose = require('mongoose')
var DBurl = require('./../config')
mongoose.connect(DBurl.url)
var users =[
    new user({
        username: "customer",
        password: "123456",
        fullName:"togepi",
        address: "HCM",
        phone: '01223456',
        email: 'topi@gmail.com',
        type: "customer",
        del:true,
    }), 
    new user({
        username: "supplier",
        password: "123456",
        fullName:"manager",
        address: "HCM",
        phone: '0122345',
        email: 'supplier@gmail.com',
        type: "supplier",
        del:true,
    }),
    new user({
        username: "shipper",
        password: "123456",
        fullName:"shipper",
        address: "HCM",
        phone: '0122345',
        email: 'supplier@gmail.com',
        type: "shipper",
        del:true,
    }),
    new user({
        username: "supplier_2",
        password: "123456",
        fullName:"supplier_2",
        address: "HCM",
        phone: '0122345',
        email: 'supplier@gmail.com',
        type: "supplier",
        del:true,
    }), 
    new user({
        username: "admin",
        password: "123456",
        fullName:"admin",
        address: "HCM",
        phone: '0122345',
        email: 'supplier@gmail.com',
        type: "admin",
        del:true,
    }) 
];
var done = 0;
for(var i =0 ;i<users.length;i++){
    users[i].save(function(err,result){
        done ++;
        if(done === users.length){
            mongoose.disconnect();
        }
    });
}
