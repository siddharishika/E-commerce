const express=require('express');
const Review=require('../models/Reviews');
const { model } = require('mongoose');
const Product = require('../models/Products');
const { validateReview, isLoggedIn } = require('../middleware');
const router=express.Router();

router.post('/products/:id/rating' ,isLoggedIn, validateReview, async (req,res)=>{
    try{
        let {id} = req.params;
        let {rating, comment} = req.body;
        //console.log(req.body);
        let product= await Product.findById(id);
        let review = new Review({rating, comment});
        //console.log(product);
        product.reviews.push(review);
    
        await product.save();
        await review.save();
        req.flash('success' , 'Review added successfully');
        
       res.redirect(`/products/${id}` );
    }catch(e){
        req.flash('error' , 'Error in adding review');
        res.render('error' , {err: e.message});
    }
})




module.exports=router ;