const express=require('express');
const User = require('../models/User');
const passport = require('passport');
const passportLocalMongoose=require("passport-local-mongoose")
const router=express.Router();

router.get('/signup' , (req, res)=>{
    res.render('auth/signup');

})
router.post('/signup'  ,async(req,res)=>{
    let{ username, email,password, gender , role} = req.body;
    console.log(req.body);
    let user=new User( {username, email, gender ,role});
    let newUser =await User.register(user, password);
    res.redirect('/products');
})

router.get('/login' , (req,res)=>{
    res.render('auth/login');
})
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    //console.log(currentUser);
    req.flash('success' , `Welcome back ${req.user.username}`)
    res.redirect('/products');
  });

router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      console.log(req.user);
      res.redirect('/login');
    });
});
  


module.exports=router ;