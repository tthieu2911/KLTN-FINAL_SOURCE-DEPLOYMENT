var userSchema = require('./../../data/models/user')
var Messages = require('./../../data/messages.json');
var mongoose = require('mongoose')
var DBurl = require('./../../data/config')
mongoose.connect(DBurl.url)

var today = new Date();

// Tạo người dùng mới
var create_user = (req, res, next)  => {
    var userName = req.body.userName;
    var passWord = '123456';
    var fullName = req.body.fullName;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var type = req.body.selected_type;

    var users = new userSchema({
        username: userName,
        password: passWord,
        fullName: fullName,
        address: address,
        phone: phone,
        email: email,
        type: type.toLowerCase(),
        createDate: today
    });

    if (users == null) {
        console.log("create user 's profile failed. Can not find user.");
        req.flash('message', Messages.signup.failed);
        res.redirect('/admin/create_user');
    }
    else {
        userSchema.findOne({ username: userName }, (err, doc) => {
            if (doc != null) {
                console.log("create user failed. Username exsited.");
                req.flash('message', Messages.user.create.exist);
                res.redirect('/admin/create_user');
            }
            else{
                users.save().then(() => {
                    console.log('create user successfully!');
                })
                req.flash('success', Messages.signup.success);
                res.redirect('/admin');
            }
        })
    }
}

//  Sửa thông tin người dùng
var edit_user = (req, res, next) => {
    var id_user = req.params.id;
    var fullName = req.body.fullName;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var type = req.body.selected_type;

    userSchema.findOne({ _id: id_user }, (err, doc) => {
        if (doc == null || doc.length == 0) {
            console.log("Update user 's profile failed. Can not find user.");
            req.flash('message', Messages.user.not_Found);
            res.redirect('/admin/edit_user/' + id_user);
        }
        else {
            doc.fullName = fullName;
            doc.email = email;
            doc.phone = phone;
            doc.address = address;
            doc.updateDate = today;
            doc.type = type.toLowerCase(),
            doc.save().then(() => {
                console.log('Update user successfully.');
                req.flash('success', Messages.user.profile.update_success);
                res.redirect('/admin');
            });
        }
    });
}

// Xóa người dùng
var delete_user = (req, res, next) => {
    var id_user = req.params.id;
    console.log(id_user)
    userSchema.deleteMany({ _id: id_user}, (error, doc) => {
        console.log(doc);
        if (doc == null || doc.length == 0) {
            console.log("Can not find user.");
            req.flash('message', Messages.user.delete.failed);
            res.redirect('/admin');
        }
        else {
            console.log("Delete user succesfully.");
            req.flash('success', Messages.user.delete.success);
            res.redirect('/admin');
        }
    })
}

module.exports = {
    create_user,
    edit_user,
    delete_user
}