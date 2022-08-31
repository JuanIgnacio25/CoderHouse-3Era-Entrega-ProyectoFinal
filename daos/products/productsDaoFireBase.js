const express = require('express');
const router = express.Router();
const Container = require('../../containers/containerFirebase');
const {mongo: users} = require('../../passport/passport');

const colProducts = new Container('products')


router.get('/', (req, res) => {
    const entry = JSON.stringify(req.params);
    const getProducts = (async () => {
        const products = await colProducts.getAll();
        const data = await users.findUser(req.session.passport.user);
        res.render('home',{obj:[{products: products},{data: data.dataValues}]});
    }) ();
});


router.get('/:id', (req, res) => {
    const getProduct = (async () => {
        const doc = await colProducts.getById(req.params.id);
        if (!doc) {
            res.status(404).send({error: "producto no encontrado"});
            console.log("prod no encontrado")
        }
        else {
            const products = [doc]
            res.send({products});
        }
    }) ();
});

router.post('/', (req, res) => {
    const newProduct = req.body;
    newProduct.timestamp = Date.now();
    const getProducts = (async () => {
        const newId = await colProducts.save(newProduct);
        res.send(`producto agregado, id: ${newId}`);
    }) ();
});

router.put('/:id',  (req, res) => {
    const updateProduct = (async () => {
        const result = await colProducts.replaceById(req.params.id, req.body);
            if (!result) res.status(404).send({error: "producto no encontrado"});
            else res.send('producto modificado');
        }) ();
});


router.delete('/:id',  (req, res) => {
    const deleteProduct = (async () => {
        const result = await colProducts.deleteById(req.params.id);
        if (!result) res.status(404).send({error: "producto no encontrado"});
        else res.send("producto eliminado");
    }) ();
});

module.exports = {router,colProducts,Container};