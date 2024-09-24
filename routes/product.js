const express = require('express');
const router = express.Router();
const { productModel, validateProduct } = require('../models/product-model');
const upload = require('../config/multer');
const { categoryModel } = require('../models/category-model');
const { validateAdmin, userIsLoggedIn } = require('../middlewares/admin');
const { cartModel } = require('../models/cart-model');


router.get('/', userIsLoggedIn, async function (req, res) {

  let somethingInCart = false;


  const productsByCategory = await productModel.aggregate([
    {
      // Group products by the 'category' field
      $group: {
        _id: "$category",
        products: { $push: "$$ROOT" }
      }
    },
    {
      // Limit to 10 products per category
      $project: {
        products: { $slice: ["$products", 10] }
      }
    }
  ]);

  let cart = await cartModel.findOne({ user: req.session.passport.user });
  if (cart && cart.products.length > 0) {
    somethingInCart = true;
  }

  let rnproducts = await productModel.aggregate([{ $sample: { size: 3 } }])

  // Convert the result array into a plain object
  const result = productsByCategory.reduce((acc, category) => {
    acc[category._id] = category.products;
    return acc;
  }, {});

  res.render('index', { products: result, rnproducts, somethingInCart, cartCount: cart ? cart.products.length : 0 });

});


router.post('/', upload.single('image'), async (req, res) => {
  const { name, price, category, stock, description } = req.body;

  // Get the image buffer and content type
  const image = req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : null;

  // Validate product data (update the validation schema to allow buffer images)
  const { error } = validateProduct({ name, price, category, stock, description, image });
  if (error) return res.status(400).send(error.message);

  try {
    // Check if category exists, create if not
    let isCategory = await categoryModel.findOne({ name: category });
    if (!isCategory) {
      await categoryModel.create({ name: category });
    }

    // Create the product with the buffer image
    await productModel.create({
      name,
      price,
      category,
      image, // Image now contains the buffer and content type
      description,
      stock,
    });

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error fetching or creating category:', error);
    res.status(500).send('Internal Server Error');
  }
});



router.get('/delete/:id', validateAdmin, async (req, res) => {
  req.user = { admin: true }; // Temporary manual setting
  if (req.user.admin) {
    let prods = await productModel.findOneAndDelete({ _id: req.params.id });
    return res.redirect('/admin/products');
  }
  res.send('you are not allowed to delete this product');
});

router.post('/delete', validateAdmin, async (req, res) => {
  req.user = { admin: true }; // Temporary manual setting
  if (req.user.admin) {
    let prods = await productModel.findOneAndDelete({ _id: req.body.product_id });
    return res.redirect("back");
  }
  res.send('you are not allowed to delete this product');
});


module.exports = router;