require('dotenv').config({ path: './.env' });;
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const  {mongoClient} = require('./util/database');
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('66082e5eb35f7d13168bc59a')
    .then(user => {
      // console.log(user);
      req.user = new User(user.name, user.email, user.cart, user._id);
      // console.log(req.user);
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
 app.use(shopRoutes);

 app.use(errorController.get404);

mongoClient(function()  {
  console.log('Connected successfully to DB server'); 
  app.listen(3000);
  console.log('Listening on port 3000');
});
// i want to connect to the mongo db database that i created in util folder
