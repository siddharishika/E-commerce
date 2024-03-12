const express=require('express');
const Review=require('../models/Reviews');
const { model } = require('mongoose');
const Product = require('../models/Products');
const { isLoggedIn } = require('../middleware');
const User=require('../models/User');
const Cart=require('../models/Cart');
const router=express.Router();
const stripe = require('stripe')('sk_test_51OkhfXSGlevoTfWloJOuajXbav6r3nIinpkqUxiof2vZJxQqimEWfITsc1GUyjerej4xccTxgCkTdzjXnIdZwRbN00VyR2xjx4')

router.get('/user/cart' ,isLoggedIn, async(req,res)=>{
    
    try{let user=req.user;
    //user=await Cart.findById(id).populate('cart');
    let cart =await Cart.findOne({ 'user': user._id }).exec();
    cart=await cart.populate('product');
    //console.log(cart);
   //res.send(cart);
   let sum=0;
    for(let i=0;i<cart.product.length ; i++){
        sum=sum+ cart.product[i].price * cart.quantity[i];
    }
    console.log(sum);
    
    res.render('cart/cart' , {currentUser:user , cart , sum });
    }catch(e){
        res.render('error' ,{ err: e.message , currentUser: req.user});
    }
})

router.post('/user/:id/add' ,isLoggedIn , async(req,res)=>{
    try{let {id} = req.params;
        let user=req.user;
        //console.log("IN HERE");
        //console.log(user);
    // let product=await Product.findById(id);
    let cart =await Cart.findOne({ 'user': user._id}).exec();
    //cart.populate('product');
    //save(cart);
    //onsole.log(cart);
    // res.send(cart);
        //let { product , quantity } = await Cart.findById(id);
        console.log(cart);
        if(!cart){
            let pros=[];
            pros.push(id);
            let quants=[];
            quants.push(1);
            await Cart.create({'user' : user._id, 'product': pros, 'quantity': quants});
            
        }else{
            if(cart.product.includes(id)){
                
                let index=cart.product.indexOf(id);
                let x= cart.quantity;
                
                let quant = x[index]+1;
                x[index] = quant;
                const update = { 'quantity' : x  };
                await Cart.findByIdAndUpdate(cart._id, update)  ; 
            }else{
                cart.product.push(id);
                //let x=cart.product.length-1;
                cart.quantity.push(1);
                cart.save();
            }
        }
        //console.log(cart);
        res.redirect(`/user/cart`);
    }catch(e){
        res.render('error' ,{ err: e.message , currentUser: req.user});
    }


})

router.post('/user/:id/remove',isLoggedIn , async (req,res)=>{
    let {id} = req.params;
    let user=req.user;
    let cart =await Cart.findOne({ 'user': user._id }).exec();
    cart=await cart.populate('product');
    let pro=await Product.findById(id);
   let index=-1;
    for(let item of cart.product){
       
        index++;
        if(item._id == id){
            break;
        }
    }
   
    let a=cart.quantity;
    //console.log(index);
    if(index >=0){
        if(a[index] > 1){
            let x= cart.quantity;
            let quant = x[index]-1;
            x[index] = quant;
            const update = { 'quantity' : x  };
            console.log(x);
            await Cart.findByIdAndUpdate(cart._id, update)  ;  
        }else{
            let arr=cart.quantity.filter((element , pos)=>{
                if(index == pos){
                    return false;
                }
                return true;
            })
            console.log(arr);
            const update = { 'quantity' : arr  };
            await Cart.findByIdAndUpdate(cart._id, update)  ; 
            cart.save();

            await Cart.findByIdAndUpdate( cart._id , {$pull : {product : id}});
        }
    }
    
    cart.save();
    res.redirect('/user/cart');

})

router.post('/user/:id/delete' ,isLoggedIn , async(req,res)=>{
    try{let {id} = req.params;
        let user=req.user;
        let cart =await Cart.findOne({ 'user': user._id }).exec();
        cart=await cart.populate('product');
        let index=-1;
        for(let item of cart.product){
            index++;
            if(item._id == id){
                break;
            }
        }
        let arr=cart.quantity.filter((element , pos)=>{
            if(index == pos){
                return false;
            }
            return true;
        })
        //console.log(arr);
        const update = { 'quantity' : arr  };
        await Cart.findByIdAndUpdate(cart._id, update)  ; 
        cart.save();

        await Cart.findByIdAndUpdate( cart._id , {$pull : {product : id}});
        res.redirect('/user/cart');
    }catch(e){
        res.render('error' ,{ err: e.message , currentUser: req.user});
    }
})

router.get('/checkout' , isLoggedIn ,async(req,res)=>{
    try{let user=req.user;
        //user=await Cart.findById(id).populate('cart');
        let cart =await Cart.findOne({ 'user': user._id }).exec();
        cart=await cart.populate('product');
        console.log(cart);
       //res.send(cart);
        let arr=cart.product.map((item,index)=>{
            return {
                price_data: {
                  currency: 'inr',
                  product_data: {
                    name: item.name,
                  },
                  unit_amount: ((item.price)*100),
                },
                quantity: cart.quantity[index],
              }
        } )
       const session = await stripe.checkout.sessions.create({
        line_items: arr,
        mode: 'payment',
        success_url: 'http://localhost:4242/success',
        cancel_url: 'http://localhost:4242/cancel',
      });
    
      res.redirect(303, session.url);
        
        }catch(e){
            res.send(e);
        }
   
})



module.exports=router ;