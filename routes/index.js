var express = require('express');
var app = express.Router();
var signin = require('./../controller/user/signin')
var signup = require('./../controller/user/signup')
var load_page = require('./../controller/user/load_page')
var csrf = require('csurf')
var csrfProtection = csrf();
// app.use(csrfProtection);
// '/' (login)
app.get('/',load_page.isloggedIn,(req,res)=>{
    res.render('index');
})
app.post('/',signin.checked);
// signup
app.get('/signup',(req,res)=>{
  res.render('signup')
})
app.post('/signup',signup.save_data)
app.get('/logout',async (req,res,next)=>{
    if (req.session) {
        await req.session.destroy(function(err) {
          if(err) {
            return next(err);
          } else {
            return res.redirect('/');
          }
        });
      }
})
app.get('/forgot_pass',(req,res)=>{
  res.render('forgot_password')
})
// Các hàm xử lí user
var handling = require('../controller/user/handling_user')
app.post('/forgot_pass',handling.update_user_pass)
app.post('/update_profile',handling.update_profile)
app.post('/change_password',handling.update_password)
module.exports = app;