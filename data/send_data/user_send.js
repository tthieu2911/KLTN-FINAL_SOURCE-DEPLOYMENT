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
        type: "customer"
    }), 
    new user({
        username: "manufacturer",
        password: "123456",
        fullName:"Manu Li",
        address: "HCM",
        phone: '036224521',
        email: 'manufacturer@gmail.com',
        type: "manufacturer"
    }),
    new user({
        username: "supplier",
        password: "123456",
        fullName:"mizuho logi",
        address: "HCM",
        phone: '0122345',
        email: 'supplier@gmail.com',
        type: "supplier"
    }),
    new user({
        username: "shipper",
        password: "123456",
        fullName:"vanti cat",
        address: "HCM",
        phone: '0122345',
        email: 'supplier@gmail.com',
        type: "shipper"
    }),
    new user({
        username: "retailer",
        password: "123456",
        fullName:"Koohii",
        address: "HCM",
        phone: '0122345',
        email: 'retailer@gmail.com',
        type: "retailer"
    }), 
    new user({
        username: "admin",
        password: "admin@123",
        fullName:"administrator",
        address: "HCMUS - VNU, Tp.HCM",
        phone: '00999999999',
        email: 'admin.123@gmail.com',
        type: "admin"
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
