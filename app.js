const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const app=express();
const passport=require('passport');
require('./config/passport')(passport);
const flash=require('connect-flash');
const mongoose=require('mongoose');
const session=require('express-session');
//DB
const db=require('./config/keys').MongoURI;
const opt = {  
    authSource: 'admin',
    useNewUrlParser: true
}
mongoose.connect(db, opt).then(function () {
    console.log('Mongodb connect success!')
}, function (err) {
    console.log('Mongodb connect error: ', err)
}) 

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//bodyparser
app.use(express.urlencoded({extended:false}));

//express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//passport-middleware
app.use(passport.initialize());
  app.use(passport.session());


//connect flash
app.use(flash());

//global vars
app.use((req,res,next)=>{
	res.locals.success_msg=req.flash('success_msg');
	res.locals.error_msg=req.flash('error_msg');
	res.locals.error=req.flash('error');
	next();
});

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
const PORT=process.env.PORT||3000;
app.listen(PORT,console.log('Sv Running on ${PORT}'));