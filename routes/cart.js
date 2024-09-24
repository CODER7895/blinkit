const express = require('express');
const router = express();
const { cartModel, validateCart } = require('../models/cart-model');
const { validateAdmin, userIsLoggedIn } = require('../middlewares/admin');
const { productModel, validateProduct } = require('../models/product-model');
const { number } = require('joi');

router.get('/', userIsLoggedIn, async function (req, res) {
    try {
        let cart = await cartModel.findOne({ user: req.session.passport.user }).populate("products");

        let cartDataStructure = {};

        cart.products.forEach((product)=>{
            let key = product._id.toString();
            if(cartDataStructure[key]){
                cartDataStructure[key].quantity += 1;
            }
            else{
                cartDataStructure[key] = {
                    ...product._doc,
                    quantity:1 ,
                };
            }
        });

        let finalarray = Object.values(cartDataStructure);
        let totalProductPrice = finalarray.reduce((acc, item) => acc + item.quantity * item.price, 0);
       // Add ₹34 fixed charge only if there are products in the cart
       let finalprice = totalProductPrice > 0 ? totalProductPrice + 34 : totalProductPrice;

        res.render('cart', { cart: finalarray, finalprice: finalprice })
    }
    catch (err) {
        res.send(err.message);
    };
});

router.get('/add/:id', userIsLoggedIn, async function (req, res) {
    try {

        let cart = await cartModel.findOne({ user: req.session.passport.user });
        let product = await productModel.findOne({ _id: req.params.id });
        if (!cart) {
            cart = await cartModel.create({
                user: req.session.passport.user,
                products: [req.params.id],
                totalPrice: Number(product.price),
            });
        }
        else {
            cart.products.push(req.params.id);
            cart.totalPrice += Number(product.price);

            await cart.save();
        }
        res.redirect("back")

    }
    catch (err) {
        res.send(err.message);
    }
});

router.get('/remove/:id', userIsLoggedIn, async function (req, res) {
    try {

        let cart = await cartModel.findOne({ user: req.session.passport.user });
        let product = await productModel.findOne({ _id: req.params.id});

        if (!cart) return res.send('There Is Nothing In The Cart');
        
        else {
            let prodId = cart.products.indexOf(req.params.id);
            cart.products.splice(prodId, 1);
            cart.totalPrice -= Number(product.price);
            await cart.save();
        }

        res.redirect("back")
    }
    catch (err) {
        res.send(err.message);
    }
});

router.get('/remove/:id', userIsLoggedIn, async function (req, res) {
    try {

        let cart = await cartModel.findOne({ user: req.session.passport.user });
        if (!cart) return res.send('Something went Wrong while removing item.');
        let index = cart.products.indexOf(req.params.id);
        if (index !== -1) cart.products.splice(index, 1);
        else return res.send('item is not in the cart');

        await cart.save();
        res.redirect("back")
    }
    catch (err) {
        res.send(err.message);
    }
});

module.exports = router;