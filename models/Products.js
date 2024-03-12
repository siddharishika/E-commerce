const mongoose=require('mongoose');
const Review=require('./Reviews');



let productSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            trim:true,
            required: true
        },
        img:{
            type: String,
            trim: true
        },
        price:{
            type: Number,
            min:0,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        reviews:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'Review'
            }],
        author:
        {
           type:mongoose.Schema.Types.ObjectId,
           ref: 'User'
        }
        
    }
)

let Product = new mongoose.model('Product' , productSchema);

module.exports = Product;