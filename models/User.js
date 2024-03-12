const mongoose=require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let userSchema=new mongoose.Schema({
    email: {
        type: String, 
        trim:true,
        required: true
    },
    gender: {
        type: String,
        trim: true,
        required: true
    },
    role:{
        type: String,
        default : 'Buyer'
    },
    wishlist:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
    

})
userSchema.plugin(passportLocalMongoose);
let User=mongoose.model('User' , userSchema);



module.exports=User;