var userSchema = require('./../../data/models/user')
var Messages = require('./../../data/messages.json')
var update_profile = (req,res,next)=>{
    var fullName = req.body.fullName;
    var phone = req.body.phone;
    var address = req.body.address;
    var email = req.body.email;
    var id_user = req.session.userId;
    userSchema.findOne({ _id: id_user}, (err, doc)=>{
        if (doc==null){
            res.redirect('/'); 
        }
        else{
        doc.fullName =fullName;
        doc.address = address;
        doc.phone = phone;
        doc.email= email;
        doc.save().then(()=>{
            console.log('Cập nhật cá nhân')
        });
        res.redirect('/'+doc.type+'/profile'); 
    }
      });
}
// Đổi mật khẩu
var update_password = async (req,res,next)=>{
    var password = req.body.passWord;
    var passWord_new = req.body.passWord_new;
    var user_id = req.session.userId;
    var type = req.body.type;
    await userSchema.findOne({_id:user_id,password:password},(err,doc)=>{
        if(doc==null)
        {
            console.log(type)
            if(type=="customer")
            {
                req.flash('message',Messages.update_password.password_false)
                res.redirect('/customer/profile')
                return res.end();
            }
            if(type=="supplier")
            {
                req.flash('message',Messages.update_password.password_false)
                res.redirect('/supplier/profile')
                return res.end();
               
            }
            if(type=="shipper")
            {
                req.flash('message',Messages.update_password.password_false)
                res.redirect('/shipper/profile')
                return res.end();
            }
        }
        else
        {
            doc.password = passWord_new;
            doc.save().then(()=>{
                console.log('Change user success')
            });
            if(type=="customer")
            {
                req.flash('success',Messages.update_password.success)
                res.redirect('/customer/profile')
                return res.end();
            }
            if(type=="supplier")
            {
                req.flash('success',Messages.update_password.success)
                res.redirect('/supplier/profile')
                return res.end();
            }
            if(type=="shipper")
            {
                req.flash('success',Messages.update_password.success)
                res.redirect('/shipper/profile')
                return res.end();
            }
    }
})}
// Hàm lấy lại mật khẩu
var update_user_pass = async (req,res,next)=>{
    var passWord = req.body.passWord;
    var repass = req.body.repassWord;
    var get_email = req.body.email;
    var userName = req.body.userName;
    if (passWord != repass)
    {
       return res.render('forgot_password',{message:Messages.forgot_pw.pass_equal_pass});
    }
    else
    {
        await userSchema.findOne({ username: userName}, (err, doc)=>{
            if (doc==null){
                return res.render('forgot_password',{message:Messages.forgot_pw.username});
            }
            else
            {
                if (doc.email == get_email) 
                {
                    doc.password = passWord;
                    doc.save().then(()=>{
                        console.log('Lấy lại pass')
                    });
                    res.redirect('/'); 
                }
                else{
                   return res.render('forgot_password',{message:Messages.forgot_pw.email_false})
                }
            }
        });
    }
    
}

module.exports = {
    update_profile,
    update_user_pass,
    update_password,
}