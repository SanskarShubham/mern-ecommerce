const { getDB } = require('../util/database');
const mongodb = require('mongodb');

class User {
  constructor(name, email, cart, _id) {
    this.name = name;
    this.email = email;
    this._id = _id;
    this.cart = cart;// {items: []}
  }

  save() {
    const db = getDB();
    return db.collection('users').insertOne(this);
  }
  addToCart(product) {

    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity
      });
    }

    const updatedCart = { items: updatedCartItems };
    const db = getDB();

    return db.collection('users').updateOne(
      { _id: new mongodb.ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    );
  }
  async getCart() {
    const db = getDB();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    const products = await db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();
    const productsCart = products.map(p => {
      return {
        ...p,
        quantity: this.cart.items.find(i => {
          return i.productId.toString() === p._id.toString();
        }).quantity
      }
    })
    console.log(productsCart);
    return productsCart;
  }
  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(p => p.productId.toString() !== productId.toString());
    const db = getDB();
    return db.collection('users').updateOne(
      { _id: new mongodb.ObjectId(this._id) },
      { $set: { cart: {items: updatedCartItems} } }
    )
  }
  static async findById(id) {
    const db = getDB();
    const user = await db.collection('users').findOne({ _id: new mongodb.ObjectId(id) });
    return user;
  }
}
module.exports = User;
