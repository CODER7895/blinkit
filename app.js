const express = require('express');
const app = express();
const path = require('path');
const indexRouter = require('./routes/index-route');
const authRouter = require('./routes/auth');
const session = require('express-session');
const adminRouter = require('./routes/admin');
const cookieParser = require('cookie-parser');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const userRouter = require('./routes/user');
const cartRouter = require('./routes/cart');


require('dotenv').config();
const passport = require('./config/passport');
require('./config/mongoose');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,  // Replace with your own secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set secure: true if using HTTPS
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);

app.listen(process.env.PORT || 3000);