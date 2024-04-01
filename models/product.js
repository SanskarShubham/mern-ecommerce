const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // }
})


// const { getDB } = require('../util/database');
// const mongodb = require('mongodb');
// class Product {
//   constructor( title, imageUrl, description, price, userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//     this.userId = userId
//   }

//   async save(id) {
//     try {
//       const db = getDB();
//       console.log(this);
//       if (id) {
//         console.log('update');
//         const result = await db.collection('products').updateOne({ _id: new mongodb.ObjectId(id) }, { $set: this });
//         return result;
//       } else {
//         console.log('insert');
//         const result = await db.collection('products').insertOne(this);
//         return result;
//       }
//       // console.log(result);
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   static async findAll() {
//     try {
//       const db = getDB();
//       const result = await db.collection('products').find().toArray();
//       return result;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   static async findById(id) {
//     try {
//       const db = getDB();
//       const result = await db.collection('products').findOne({ _id: new mongodb.ObjectId(id) });
//       return result;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   static async deleteById(id) {
//     try {
//       const db = getDB();
//       const result = await db.collection('products').deleteOne({ _id: new mongodb.ObjectId(id) });
//       console.log(result);
//       return result;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

 module.exports = mongoose.model('Product', productSchema);
