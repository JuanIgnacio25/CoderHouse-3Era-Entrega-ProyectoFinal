const express = require('express');
const router = express.Router();
const {Container: container} = require('../products/productsDaoFireBase');
const {colProducts: colProducts} = require('../products/productsDaoFireBase');

const colCarts = new container('Carts');


router.post('/', (req, res) => {
    const newCart = {
        timestamp : Date.now(),
        products: []
    };
    const getCart = (async () => {
        const newId = await colCarts.save(newCart);
        res.send(`carrito agregado id: ${newId}`);
    }) ();
});

router.delete('/:id', (req, res) => {
    const deleteCart = (async () => {
        const result = await colCarts.deleteById(req.params.id);
        if (!result) res.status(404).send({error: "carrito no encontrado"});
        else res.send("carrito eliminado");
    }) ();
});


router.get('/:id/productos', (req, res) => {
    const getCart = (async () => {
        const cart = await colCarts.getById(req.params.id);
        if (!cart) res.status(404).send({error: "carrito no encontrado"});
        else res.json(cart.products);
    }) ();
});


router.post('/:id/productos', (req, res) => {
    const idCart = req.params.id;
    const idProduct = String(req.body.id);
    const getProduct = (async () => {
        const productToAdd = await colProducts.getById(idProduct);
        if (!productToAdd) res.status(404).send({error: "producto no encontrado"});
        else {
            const getCart = (async () => {
                const cart = await colCarts.getById(idCart);
                if (!cart) res.send('error: no existe ese carrito');
                else {
                    productToAdd['id'] = idProduct;
                    cart.products.push(productToAdd);
                    const updateCart = (async () => {
                        const cartModified = await colCarts.replaceById(idCart, cart);
                        res.send(`producto id: ${idProduct} agregado en carrito id: ${idCart}`);
                    }) ();
                }
            }) ();
        }
    }) ();
});


router.delete('/:id/products/:id_prod', (req, res) => {
    const idCart = req.params.id;
    const idProduct = req.params.id_prod;
    const getCart = (async () => {
        const cart = await colCarts.getById(idCart)
        if (!cart) res.send('error: no existe ese carrito');
        else {
            const productFind = cart.products.find((prod) => prod.id === idProduct);
                if (!productFind) res.send('error: no existe ese producto en el carrito');
                else {
                    cart.products = cart.products.filter((prod) => prod.id !== idProduct);
                    const updateCart = (async () => {
                        const cartModified = await colCarts.replaceById(idCart, cart);
                        res.send(`producto id: ${idProduct} eliminado del carrito id: ${idCart}`);
                    }) ();
                }
            }
        }) ();
    
});

module.exports = router;