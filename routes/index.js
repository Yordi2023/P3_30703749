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



router.post('/', (req, res) => {
    db.getProducts()                        //Ir a la página en dónde se mostrará una tabla con los productos almacenados en db
        .then(data => {       
            db.getImages()
            .then(images => {               
                    const filters = req.body;
                    const filteredProducts = data.filter(p => {
                        let isValid = true;
                        for (key in filters) {
                        //console.log(filters[key]);
                        isValid = isValid && p[key] == filters[key];
                        }  
                        return isValid;             
                    });
                    console.log(filteredProducts);
                    res.render('index', { products: filteredProducts, images: images });                   
            })
            .catch(err => {
                res.render('index', { products: data, images: []});              ///Pasando los productos al index.ejs del admin sin iagenes
            }) 
        })
        .catch(err => {
            res.render('index', { products: [], images: []});                //Si hubo error, cargar la página pero sin datos
        });
  
});

router.post('/login', (req, res) => {
    res.redirect('/admin');
})

module.exports = router;
