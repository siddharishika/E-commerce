const Product = require('./models/Products');
const {productSchema , reviewSchema} = require('./schema');

//console.log(productSchema);
const validateProduct=(req,res,next)=>{
    let {name,img, price, desc} =req.body;

    const {error} =productSchema.validate({name,img, price, desc});
    console.log(error);
    if(error){
        let ans=error.details.map((err)=>{
             return err.message
        }).join(',');
        console.log(ans);
        return res.render('error' , {err : ans});
    }
    next();
}

const validateReview=(req , res , next)=>{
    let {rating, comment} = req.body;
    const {error}= reviewSchema.validate({rating , comment });
    if(error){
        let ans=error.details.map((err)=>{
            return err.message
        }).join(',');
        return res.render('error' , {err:ans});
    }
    next();
}
const isLoggedIn = (req,res,next)=>{
    
    if(req.xhr && !req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        req.flash('error' , 'You need to login first');
        //res.redirect('/login');
        return res.error({msg : 'You need to login first'});
    }
    if(!req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
       
        req.flash('error' , 'You need to login first');
        return res.redirect('/login');
    }
    //console.log("IN NEXT")
    next();
}
const isSeller=(req,res,next)=>{

    if(req.user.role !== 'Seller'){
        req.flash('error','You are not a seller');
        res.redirect('/products');
    }
    next();
}

const isProductAuthor =async(req,res,next)=>{
    let {id} = req.params;
    let found=await Product.findById(id);
    console.log(found.author);
    console.log(req.user);
    if(req.user._id != found.author){
        req.flash('error' ,'You are not the author of this product');
        
        res.redirect('/products/'+id);
    }
    next();
}
module.exports= {validateProduct , validateReview , isLoggedIn, isSeller, isProductAuthor };