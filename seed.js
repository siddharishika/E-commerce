const mongoose=require('mongoose');

const Product=require('./models/Products');

const products=[
    {
        name: "Iphone", 
        img :"https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 
        price: 100000 , 
        desc:"Best phone in the world" 
    },
    {
        name: "Apple Watch", 
        img :"https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 
        price: 50000 , 
        desc :"Best smart watch in the world" 
    },
    {
        name: "Air Pods", 
        img :"https://images.unsplash.com/photo-1592921870583-aeafb0639ffe?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" , 
        price: 25000 , 
        desc:"Best earphones in the world" 
    }
]
async function seeddb(){
    await Product.insertMany(products);
}
module.exports = seeddb;