const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add-courses');
const cartRoutes = require('./routes/cart');
const userMiddleware = require('./middlewares/user');

const app = express();

const hbs = exphbs({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(handlebars),
});

app.engine('hbs', hbs);
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);

const PORT = process.env.PORT || 3000;

async function start(){
  const url = `mongodb+srv://dshmaliuk:3esUB8CeogPvg2U7@cluster0.4znuh.mongodb.net/courses-shop?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
    app.listen(3000, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
  }
  catch (err) {
    console.log(err);
  }
};

start();
