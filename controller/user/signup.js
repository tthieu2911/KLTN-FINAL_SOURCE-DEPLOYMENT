var userSchema = require('./../../data/models/user')
var Messages = require('./../../data/messages.json');
var mongoose = require('mongoose')
var DBurl = require('./../../data/config')
mongoose.connect(DBurl.url)
var save_data= async(req,res,done)=>{
    var userName = req.body.userName;
    var passWord = req.body.passWord;
    var passWrord_2 = req.body.repeatPassWord;
    var fullName = req.body.fullName;
    var phone = req.body.phone;
    var check = null;
    await check_dulicate(userName,(value)=>{
        check = value;
    
    });
    if(check == true)
    {
        console.log(Messages.signup.duplicateAccount)
        return res.render('signup',{message:Messages.signup.duplicateAccount})
    }
    else if(passWord!=passWrord_2)
    {
        console.log(Messages.signup.pass_equal_pass)
        return res.render('signup',{message:Messages.signup.pass_equal_pass})
    }
    else
    { 
        var users = new userSchema({username:userName,password:passWord,fullname:fullName,address:'',phone:phone,email:'',type:'customer'})
        users.save().then(()=>{
            console.log('insert success');
            })
        return res.render('signup',{message_sc:Messages.signup.success})
   
    }
    
}
var check_dulicate =async(name,callback)=>{
    var value = null;
    await userSchema.find({'username':name}, (err,data)=>{
        if (err) {
            console.error("Can't Find.!! Error");
        }
        //None Found
        if (data != '') {
            value = true;
        }
        else{
            value = false;
        }
        return callback(value);
    });

}
module.exports = {save_data}