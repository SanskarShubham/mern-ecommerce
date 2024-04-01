const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = async (req, res, next) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user._id).populate('cart.items.productId').exec();
    // console.log(user.cart.items);
    const products = user.cart.items;
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    });
  } catch (error) {
    console.log(error);
  }

};

exports.postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const product = await Product.findById(prodId)
    await req.user.addToCart(product)
    res.redirect('/cart');
  } catch (error) {
    console.log(error);
  }

};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    await req.user.deleteItemFromCart(prodId)
    res.redirect('/cart');
  } catch (error) {
    console.log(error);
  }

};

exports.postOrder = async (req, res, next) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user._id).populate('cart.items.productId').exec();
    const products = user.cart.items.map(p => {
      return { quantity: p.quantity, product: { ...p.productId._doc } };
    });

    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user
      },
      products: products
    })
    await order.save();
    req.user.clearCart();
    res.redirect('/orders');
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({'user.userId':req.user._id});

    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  } catch (error) {
    console.log(error);
  }
};
