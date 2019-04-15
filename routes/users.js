const express=require('express');
const router=express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const saltRounds = 10;

//login
router.get('/login',(req,res)=>res.render('login'));
//signup
router.get('/signup',(req,res)=>res.render('signup'));

router.post('/signup',(req,res)=>{
	
const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('signup', {
      errors,
      name,
      email,
      password,
      password2
    });
    }else{
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('signup', {
          errors,
          name,
          email,
          password,
          password2
        });
      } 
    else{
    	const newUser = new User({
          name,
          email,
          password
        });

    	bcrypt.genSalt(saltRounds, function(err, salt) {
    		bcrypt.hash(newUser.password, salt, function(err, hash) {
        		// Store hash in your password DB.
        		if(err) throw err;
        		newUser.password=hash;
        		newUser.save()
        			.then(user=>{
        				req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
        			})
        			.catch(err => console.log(err));
 });
        });
      }
    });
  } 
});
//LOGIN post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports=router;