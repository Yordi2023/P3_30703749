//Controlador de la ruta de vista pública
const express = require('express');
const router = express.Router();
const db = require('../db/models');

router.get('/', (req, res) => {
    db.getProducts()
    .then(data => {  
        db.getImages()
        .then(images => {
            res.render('index', { products: data, images: images });
        })
        .catch(err => {
            res.render('index', { products: data, images: [] });
        })     
    })
    .catch(err => {
        console.log(err);
        res.render('index', { products: [], images: []});
    })
});

module.exports = router;
