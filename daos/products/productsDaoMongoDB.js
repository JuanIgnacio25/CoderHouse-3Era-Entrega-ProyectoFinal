const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();


const Container = require('../../containers/containerMongoDB');

const productsSchema = new mongoose.Schema({
    title: {type: String, require: true},
    description: {type: String, require: true},
    code: {type: String, require: true},
    thumbnail: {type: String, require: true},
    price: {type: Number, require: true},
    stock: {type: Number, require: true},
    timestamp: {type: Date, require: true},
    id: {type: Number, require: true}
})
const Product = mongoose.model("product", productsSchema);
const colProduct = new Container(Product);


router.get('/', (req, res) => {
    const entry = JSON.stringify(req.params);
    const getProducts = (async () => {
        const products = await colProduct.getAll();
        res.send(products)     
    })();
});


router.get('/:id', (req, res) => {
    const getProduct = (async () => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).send({error: "el parámetro no es un número"});
        const productFinded = await colProduct.getById(id);
        if (!productFinded) {
            res.status(404).send({error: "producto no encontrado"});
            console.log("prod no encontrado")
        }
        else {          
            res.send(productFinded)
        }
    })();
});



router.post('/', (req, res) => {
    const newProduct = req.body;
    newProduct.timestamp = Date.now();
    const getProducts = (async () => {
        const newId = await colProduct.save(newProduct);
        res.send('producto agregado');
    })();
});

router.put('/:id',  (req, res) => {
    const updateProduct = (async () => {
        const id = parseInt(req.params.id);
        const newProduct = await colProduct.replaceById(id, req.body);
            if (newProduct.length == 0) res.status(404).send({error: "producto no encontrado"});
            else res.send('producto modificado');
        }) ();
});

router.delete('/:id',  (req, res) => {
    const deleteProduct = (async () => {
        const id = parseInt(req.params.id);
        const result = await colProduct.deleteById(id);
        if (result.deletedCount == 0) res.status(404).send({error: "producto no encontrado"});
        else res.send("producto eliminado");
    }) ();
});

module.exports = {router,Product};