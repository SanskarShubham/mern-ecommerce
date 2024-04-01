require('dotenv').config({ path: './.env' });;
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

// const { mongoClient } = require('./util/database');
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('660ae7443ab2446df4689d8c')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const password = process.env.MONGO_DB_PASSWORD;
const encodedPassword = encodeURIComponent(password);



mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${encodedPassword}@cluster0.hroigvw.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`).then(result => {
  User.findOne().then(user => {
    if (!user) {
      const user = new User({
        name: 'Shubham Ojha',
        email: 'shubham@gamil.com',
        cart: {
          items : []
        }
      })
      user.save();  
    }
  })
  console.log('Connected successfully to DB server');
  app.listen(3000);
  console.log('Listening on port 3000');
})

