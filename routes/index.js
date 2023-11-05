const express = require('express');
const router = express.Router();
const db = require('../db/models');

router.get('/', (req, res) => {
    db.getProducts()
    .then(data => {        
        res.render('index', { products: data });
    })
    .catch(err => {
        res.render('index', { products: [] });
    })
  
});

module.exports = router;
