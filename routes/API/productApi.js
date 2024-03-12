const express=require('express');
const { model } = require('mongoose');
const { isLoggedIn } = require('../../middleware');
const User = require('../../models/User');
const router=express.Router();


router.post('/products/:id/like',isLoggedIn , async(req,res,next)=>{
    let {id} =req.params;
    console.log(id);
    //res.send(id);
    let user=req.user;
    let isLiked=user.wishlist.includes(id)
    if(isLiked){
        await User.findByIdAndUpdate( user._id , {$pull : {wishlist : id}});
    }else{
        await User.findByIdAndUpdate( user._id , {$addToSet :{ wishlist : id}});
    }
   // console.log("hii")
    res.redirect(`/products`);
})





module.exports=router ;