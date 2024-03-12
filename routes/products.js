const Product=require('../models/Products');
const express=require('express');
const router=express.Router();
const Review=require('../models/Reviews')
const {validateProduct , isLoggedIn ,isSeller , isProductAuthor} = require('../middleware')
const review=require('./review');
const flash = require('connect-flash');

router.get('/products/new' ,isLoggedIn,isSeller, async(req,res)=>{
    try{
        
        res.render('new' , { currentUser: req.user});
    }
    catch(e){
        res.render('error' ,{ err: e.message , currentUser: req.user});

    }
})

router.post('/products' ,isLoggedIn ,isSeller,  validateProduct ,async (req,res)=>{
    //console.log(req.body);
    try{
        let {name, price, img , desc} = req.body;
        
        await Product.create({name, price, img, desc, author:req.user._id});
        req.flash('success' , 'Product added successfully');
        res.redirect('/products');
    }
    catch(e){
        req.flash('error' , 'Error in adding product');
        res.render('error' ,{ err: e.message , currentUser: req.user});

    }
})
router.get('/products' , async(req, res)=>{
    try{
        let products= await Product.find({});
        //console.log(products);
        let arr=req.flash('success');
        console.log(arr);
        res.render('index.ejs', {products:products , currentUser: req.user});
    }
    catch(e){
        res.render('error' ,{ err: e.message , currentUser: req.user });
    }
})


router.get('/products/:id' ,isLoggedIn  ,async (req, res)=>{
    try{
        let {id} = req.params;
    //console.log(id);
        let data=await Product.findById(id).populate('reviews');
        //console.log(data.reviews);
        
        res.render('show' , {data : data , currentUser: req.user});
    }
    catch(e){
        res.render('error' ,{ err: e.message , currentUser: req.user});

    }
})
router.get('/products/:id/edit' ,isLoggedIn, isSeller , isProductAuthor , async(req,res)=>{
    try{
        let {id} = req.params;
    //console.log(id);
        let found=await Product.findById(id);
        res.render('edit' , {found , currentUser: req.user});
    }
    catch(e){
        res.render('error' ,{ err: e.message , currentUser: req.user});

    }
})

router.patch('/products/:id' ,isLoggedIn, isSeller ,isProductAuthor,async(req,res)=>{
    try{
        let {id} = req.params;
    //console.log(id);
    
    let {name,img, price, desc}=req.body;
    await Product.findByIdAndUpdate(id,{name,img, price, desc});
    res.redirect('/products');

    }catch(e){
        res.render('error' ,{ err: e.message , currentUser: req.user});

    }
})


router.delete('/products/:id',isLoggedIn ,isSeller,isProductAuthor ,async(req ,res)=>{
    try{
        let {id} = req.params;
    let pro=await Product.findById(id);
    console.log(pro.reviews);
    for(ids of pro.reviews)
    {
        await Review.findByIdAndDelete(ids);
    }
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
    }catch(e){
        res.render('error' ,{ err: e.message , currentUser: req.user});

    }
})





module.exports=router;