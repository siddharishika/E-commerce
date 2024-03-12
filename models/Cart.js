const mongoose=require('mongoose');

let cartSchema=new mongoose.Schema({
    user:
    {   
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
    },
    product: [
        {   
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Product'
    }],
    quantity:[{
        type : Number ,
        default : 1,
        min : 0
    }]
    
    
})

let Review=mongoose.model('Cart' , cartSchema);

module.exports=Review;