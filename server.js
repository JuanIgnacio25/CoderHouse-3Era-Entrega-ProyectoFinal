require('dotenv').config();

const express = require('express');
const {engine} = require('express-handlebars');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const logger = require('./winston');
const compression = require('compression');

const {passport: passport} = require('./passport/passport');
//const {router : routerProductsMongo} = require('./daos/products/productsDaoMongoDB');
//const routerCartMongo = require('./daos/cart/cartDaoMongoDB');
const {router: routerProductsFireBase} = require('./daos/products/productsDaoFireBase');
const routerCartFireBase = require('./daos/cart/cartDaoFireBase');
const routerSession = require('./passport/sessionRoutes');

const app = express();

app.use((req,res,next)=>{
    logger.info(`ruta ${req.url}, método ${req.method}`)
    next()
})  

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(compression());

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGOURL,
        mongoOptions: { useNewUrlParser: true , useUnifiedTopology: true }
    }),
    secret: process.env.SECRET,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}))

app.use(passport.initialize());
app.use(passport.session());

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
    })
);

app.set('views', './public/hbs_views');
app.set('view engine', 'hbs');


app.use('/api/products', routerProductsFireBase);
app.use('/api/cart', routerCartFireBase);
app.use('/', routerSession);

const Port = process.env.PORT || 8080;

app.use((req, res) => {
    logger.warn(`ruta ${req.url}, método ${req.method} no implementada`)
    res.status(404).send({
        error: 404,
        descripción: `ruta ${req.url}, método ${req.method} no implementada`
    })
})
app.use((error, req, res, next) => {
    logger.error(error.message)
    res.status(500).send(error.message);
});

app.listen(Port, () => {
    console.log(`Escuchando en el puerto ${Port}`);
});