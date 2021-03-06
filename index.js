const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add-courses');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const errorRoutes = require('./routes/error');
const variablesMiddleware = require('./middlewares/variables');
const errorModdleware = require('./middlewares/errors');
const { MONGODB_URI, SESSION_SECRET } = require('./keys');
const app = express();

const hbs = exphbs({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(handlebars),
  helpers: require('./utils/hbs-helpers'),
});

app.engine('hbs', hbs);
app.set('view engine', 'hbs');

const store = new MongoDBStore({
  uri: MONGODB_URI,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false, store }));
app.use(csrf());
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(variablesMiddleware);

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/error', errorRoutes);
app.use(errorModdleware);

async function start(){
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port: ${process.env.PORT}`);
    });
  }
  catch (err) {
    req.flash('processError', err);
    res.redirect('/error');
  }
};

start();
