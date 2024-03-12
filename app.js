
const express =require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const seeddb=require('./seed');
const productRoutes=require('./routes/products');
const methodOverride = require('method-override')
const reviewRoutes=require('./routes/review');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const flash = require('connect-flash');
const authRoutes = require('./routes/auth');
const productApi = require('./routes/API/productApi');
const cartRoutes = require('./routes/cart');
const passport=require('passport');
const User=require('./models/User');
const LocalStrategy =require('passport-local');
const passportLocalMongoose =require('passport-local-mongoose');
const { MongoClient } = require('mongodb');

const dotenv=require('dotenv').config();
app.use(methodOverride('_method'));

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views'));

//var sessionStore = new session.MemoryStore;
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    cookie:{
        httpOnly : true,
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000
    }
  }));

app.use(flash());

app.use((req,res,next)=>{
    //res.locals.sessionFlash = req.session.sessionFlash;
    res.locals.currentUser = req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    //res.locals.message=req.flash();
    //delete req.session.sessionFlash;
    next();
})

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

passport.use(new LocalStrategy(User.authenticate()));


// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//app.use(bodyParser);


app.use(productRoutes);
app.use(reviewRoutes)
app.use(authRoutes);
app.use(productApi);
app.use(cartRoutes);

const url=process.env.MONGO_URL;
console.log(url);
//const client = new MongoClient(url);
mongoose.connect('mongodb://127.0.0.1:27017/ecomm')
.then(()=>{
    console.log("Successfully connected to database");
})
.catch((err)=>{
    console.log(`Error ${err} connecting to database`)
})



//seeddb();





//const PORT=8080;
app.listen(process.env.PORT, ()=>{
    console.log("Connected at port 8080");
})
