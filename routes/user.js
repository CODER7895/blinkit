const express = require('express');
const router = express.Router();
const {userModel, validateUser} = require('../models/user-model')

router.get("/login", (req,res)=>{
    res.render('user_login');
});

router.get('/profile',(req,res)=>{
    res.send('profile page')
});

router.get('/logout', (req,res)=>{
    req.logout((function(err){
        if(err) {
            return next(err);
        }
        req.session.destroy((err)=>{
            if(err) return next(err);
            res.clearCookie("connect.sid");
            res.redirect('/user/login');
        })
    }));
});

module.exports = router;