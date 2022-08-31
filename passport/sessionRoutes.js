const express = require('express');
const passport = require('passport');

const upload = require('../multer');
const { mongo: mongo } = require('./passport');
const transport = require('../transport');

const router = express.Router();


router.get('/', (_, res) => {
    res.render('signin');
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/error_signin', (_, res) => {
    res.render('error_signin');
});
router.get('/logout', (req,res,next) => {
    req.logout((err) => {
        if (err) return next(err)
    })
    res.redirect('/');
});

router.post('/signin', passport.authenticate('signIn', { failureRedirect: '/error_signIn', failureMessage: true }), async (req, res) => {
    const datosDeUsuario = req.body
    const obj = {
        name: datosDeUsuario.name,
        address: datosDeUsuario.address,
        number: datosDeUsuario.phone,
        age: datosDeUsuario.age
    }
    await mongo.updateUser(datosDeUsuario.username, obj);
    const user = (await mongo.findUser(datosDeUsuario.username))[0];
    console.log(user);
    transport.sendMail({
        from: "Juan Ignacio <nachocolli1@gmail.com>",
        to:process.env.GMAIL,
        html:`<h1>Datos del nuevo usuario</h1>
              <p>Email: ${user.username}</p>
              <p>Nombre: ${user.name}</p>
              <p>Dirección: ${user.address}</p>
              <p>Edad: ${user.age}</p>
              <p>Teléfono: ${user.phone_number}</p>`,
        subject:"Nuevo Usuario Creado!"
      }).then((result) => {
        console.log(result);
      }).catch(console.log) 
   
    res.redirect('/api/products/');
});

router.post('/login', passport.authenticate('auth', { failureRedirect: '/error_login', failureMessage: true }), (req, res) => {
    res.redirect('/api/products/');
});




module.exports = router;