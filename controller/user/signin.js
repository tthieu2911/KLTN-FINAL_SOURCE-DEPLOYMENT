var userSchema = require('./../../data/models/user')
var Messages = require('./../../data/messages.json')
var checked = async (req,res) =>{
    
    var userName = req.body.userName;
    var passWord = req.body.passWord;
    var check = null;
    await get_cheked_US_PS(userName,passWord,(value)=>{
        check = value;
    
    });
    if (userName == '' && passWord=='')
        return res.render('index',{message:Messages.signin.us_psnull})
    else if (userName == '')
        return res.render('index',{message:Messages.signin.namenull})
    else if(passWord=='')
        return res.render('index',{message:Messages.signin.passnull})
    else if (check == false )
    {
        var check_false = null;
        await check_us_or_ps(userName,(value)=>{
            check_false = value;})
        if(check_false==true)
            return res.render('index',{message:Messages.signin.username})
        else return res.render('index',{message:Messages.signin.password})
    }
    else
    {
        var check_type;
        await get_check_type(req,userName,(value)=>{
            check_type=value;
        })
        if(check_type==='supplier'){
            res.redirect('/supplier');
        }
           
        else if(check_type==='customer'){
            res.redirect('/customer');
        }
        else if(check_type=='shipper'){
            res.redirect('/shipper');
        }
           
    }
        
}
// Kiểm tra toàn bộ username và pass
var get_cheked_US_PS = async (name,pass, callback) => {
    var value = null;
    await userSchema.find({'username':name,'password':pass}, (err,data)=>{
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
// Kiểm tra xem name hay pass word sai
var check_us_or_ps = async(name,callback) =>{
    var value = null;
    await userSchema.find({'username':name}, (err,data)=>{
        if (err) {
            console.error("Can't Find.!! Error");
        }
        //None Found
        if (data == '') {
            value = true; // Username không tồn tại
        }
        else{
            value = false;  // => password sai
        }
        return callback(value);
    });
}
// Lấy loại người dùng để đăng nhập
var get_check_type = async(req,name,callback)=>{
    var value =null;
    await userSchema.find({'username':name},(err,data)=>{
        if (err) return handleError(err);
        data.forEach((user)=>{
            req.session.userId = user._id;
            console.log(req.session.userId);
            value=user.type;
        })
        return callback(value);
    });
}


module.exports ={
    checked,
};