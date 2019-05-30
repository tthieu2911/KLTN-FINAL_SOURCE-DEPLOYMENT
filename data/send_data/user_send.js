var user = require('../models/user')
var mongoose = require('mongoose')
var DBurl = require('./../config')
mongoose.connect(DBurl.url)
var users =[
    new user({
        username: "customer",
        password: "123456",
        fullName:"Harry don",
        address: "HCM",
        phone: '01223456',
        email: 'topi@gmail.com',
        type: "customer",
        del:true,
    }), 
    new user({
        username: "manufacturer",
        password: "123456",
        fullName:"Manu Li",
        address: "HCM",
        phone: '036224521',
        email: 'manufacturer@gmail.com',
        type: "manufacturer",
        del:true,
    }),
    new user({
        username: "supplier",
        password: "123456",
        fullName:"mizuho logi",
        address: "HCM",
        phone: '0122345',
        email: 'supplier@gmail.com',
        type: "supplier",
        del:true,
    }),
    new user({
        username: "shipper",
        password: "123456",
        fullName:"vanti cat",
        address: "HCM",
        phone: '0122345',
        email: 'supplier@gmail.com',
        type: "shipper",
        del:true,
    }),
    new user({
        username: "retailer",
        password: "123456",
        fullName:"Koohii",
        address: "HCM",
        phone: '0122345',
        email: 'retailer@gmail.com',
        type: "retailer",
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
