/****/
//Manejador de rutas para el administración, es independiente de las otras rutas que se vayan a crear
const express = require('express');             //Importando express
const router = express.Router();                //Usando el método router
const imgur = require ('imgur-node-api');                 //Importando imgur para subir imagenes
const db = require('../../db/models');          //Importando el manejador de base de datos
const fs = require('fs');                       //Importando fs para borrar archivos
require('dotenv').config();                     //Aplicando la configuración para el uso de variables de entorno
imgur.setClientID(process.env.API_IMGUR);
let logged = false;                             //Una variable para validar si el usuario inició sesión (No recomendado este uso pero es lo más sencillo por ahora)

////GET

router.get('/', (req, res) => {                 //Obteniendo la ruta principal para el administrador
    if(!logged){                                //Inició?
        res.render('admin/login');              //Si no, ir a logearse
    }else{                                      //De lo contrario
        db.getProducts()                        //Ir a la página en dónde se mostrará una tabla con los productos almacenados en db
        .then(data => {       
            db.getImages()
            .then(images => {
                res.render('admin/index', { products: data, images: images });              ///Pasando los productos y las imagenes al index.ejs del admin
            })
            .catch(err => {
                res.render('admin/index', { products: data, images: []});              ///Pasando los productos al index.ejs del admin sin iagenes
            }) 
        })
        .catch(err => {
            res.render('admin/index', { products: [], images: []});                //Si hubo error, cargar la página pero sin datos
        });
    }
});

////POST

router.post('/login', (req, res) =>{                                    //Recibiendo los datos enviados desde el login por POST
    const {user, pass} = req.body;                                      //Capturando el user y el pass
    if(user == process.env.USER_ADMIN && pass == process.env.PASS_ADMIN){       //Validando
        logged = true;                                          //Si todo bien, es true y redirecciona a la página del admin
        res.redirect('/admin')
    }else{
        logged = false;                                         //Si no, redirecciona pero en false
        res.redirect('/admin')
    }
});

router.post('/add', (req, res)=>{                                               //Recibiendo los datos enviados desde el add por POST
    const {code, name, model, description, price, count, category_id, image} = req.body;   //Capturando los datos

    db.insertProduct(code, name, model, description, price, count, category_id, image) //Insertando los datos
        .then((id)=>{
            res.redirect('/admin')
        })
        .catch(err => {             
            console.log(err);
            res.redirect('/admin')
        });
});

router.post('/delete/:id', (req, res)=>{    //Recibiendo los datos enviados desde el delete por POST
    const id = req.params.id;           //Capturando el id
    db.deleteProduct(id)                //Borrando el producto
    .then(()=>{
        res.redirect('/admin')
    })
    .catch(err => {
        console.log(err);
        res.redirect('/admin')
    });
});

router.get('/delete-image/:id', (req, res)=>{    //Recibiendo los datos enviados desde el delete por POST
    const id = req.params.id;           //Capturando el id de la imagen
    db.deleteImageProduct(id)
    .then(()=>{
        db.deleteImage(id)                //Borrando la imagen
        .then(()=>{
            res.redirect('/admin')
        })
        .catch(err => {
            console.log(err);
            res.redirect('/admin')
        });
    })
    .catch(err => {
        console.log(err);
        res.redirect('/admin')
    })
    
});

router.post('/update/:id', (req, res)=>{            //Recibiendo los datos enviados desde el update por POST
    const id = req.params.id;
    const {code, name, model, description, price, count, category_id} = req.body;
    db.updateProduct(code, name, model, description, price, count, category_id, id)
    .then(()=>{
        res.redirect('/admin')
    })
    .catch(err => {
        console.log(err);
        res.redirect('/admin')
    });
});

router.post('/logout', (req, res)=>{    //Recibiendo los datos enviados desde el logout por POST
    logged = false;                     //Si todo bien, es true y redirecciona a la página del admin
    res.redirect('/admin')
})

router.post('/upload', (req, res)=>{        //Recibiendo los datos enviados desde el upload por POST
    if(!req.files){
        return res.status(400).send('No files were uploaded.');
    }

    let sampleFile = req.files.sampleFile;
    let uploadPath = __dirname + '/' + sampleFile.name;
    sampleFile.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        imgur.upload(uploadPath, (err, _res) => {
            console.log('File uploaded!');
            console.log(_res.data.link);
            db.insertImage(_res.data.link, null, false)
            .then(()=>{
                res.redirect('/admin')
            })
            .catch(err => {
                console.log(err);
                res.redirect('/admin')
            });
        });
        fs.unlinkSync(uploadPath);
        /* imgur.upload('http://25.media.tumblr.com/tumblr_md1yfw1Dcz1rsx19no1_1280.png', function (err,res) {
        console.log(res.data.link);
        });
  
        imgur.update({
        id: 'W0JfyHW',
        title: 'My Title',
        description: 'My Description'
        }, function (err,res) {
        console.log(res.data);
        });
        
        imgur.getCredits(function (err, res) {
        console.log(res.data);
        }); */
    });
});

module.exports = router;
