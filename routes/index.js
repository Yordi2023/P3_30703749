//Controlador de la ruta de vista pública
const express = require('express');
const router = express.Router();
const db = require('../db/models');
const jwt = require('jsonwebtoken');

rutabloqueada = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, 'token', (error, tokenAuthorized) => {
            if (error) {
                console.log(error);
                return next();
            }
            if (tokenAuthorized) {
                req.user = tokenAuthorized.id;
                return next();
            }
        });
    } else {
        res.redirect("/loginclient");
    }
};



rutaloginbloqueada = async (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, 'token', (error, tokenAuthorized) => {
            if (error) {
                console.log(error);
                return next();
            }
            if (tokenAuthorized) {
                req.user = tokenAuthorized.id;
                return next();
            }
        });
    } else {
        res.redirect("/");
    }
};


router.get('/', rutabloqueada, (req, res) => {
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
            res.render('index', { products: [], images: [] });
        })
});

router.get('/loginclient', (req, res) => {
    res.render('loginclient.ejs')
})

router.get('/registerclient', (req, res) => {
    res.render('registerclient.ejs', {
        keypublic:process.env.KEYPUBLIC
    });
})

router.post('/loginclient', async (req, res) => {
    const { email, password } = req.body;
    db.getUser(email, password)
        .then((data) => {
            console.log(data);
            
            const id = data[0].id;
            const token = jwt.sign({ id: id }, 'token');
            res.cookie("jwt", token);
            res.redirect('/');
    })
    .catch((err)=>{
        console.log(err);
        res.redirect('/loginclient');
    });
});

router.post('/registerclient', async (req, res) => {
    const { email, password, address, country } = req.body;
    const key = process.env.KEYPRIVATE;
    const gRecaptchaResponse = req.body['g-recaptcha-response'];
    const url = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${key}&response=${gRecaptchaResponse}`, {
        method: 'POST',
    });
    const captcha = await url.json();
    if (captcha.success == true) {

     db.insertUser(email, password, address, country)
        .then(()=>{
            console.log("Registrado",email, password, address, country)
            res.redirect('/');
        })
         .catch((err)=>{
             console.log("Error", err)
             res.redirect('/registerclient');
        });

    } else {
        res.status(500).send('¡No se verifico el captcha!');
    }
})

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
                    res.render('index', { products: data, images: [] });              ///Pasando los productos al index.ejs del admin sin iagenes
                })
        })
        .catch(err => {
            res.render('index', { products: [], images: [] });                //Si hubo error, cargar la página pero sin datos
        });

});

router.post('/login', (req, res) => {
    res.redirect('/admin');
})


router.post('/payment/:id', rutabloqueada, async (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body;
    db.getPayment(id)
        .then(data => {
            const precio = data.price;
            const totalapagar = cantidad * precio
            res.render('paymentdetails', { product: data, image: data, cantidad: cantidad, totalapagar: totalapagar });
        })
        .catch(err => {
            res.render('paymentdetails', { product: [], image: [] });
        })

})





router.post('/pay/:id', async (req, res) => {
    const { id } = req.params;
    const { tarjeta, cvv, mes, ano, cantidad, total } = req.body;
    const fecha = new Date();
    const fechaC = fecha.toString();
    const ipPaymentClient = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
    try {
        const response = await fetch('https://fakepayment.onrender.com/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJkYXRlIjoiMjAyNC0wMS0xM1QwNzoyMzozNC42ODNaIiwiaWF0IjoxNzA1MTMwNjE0fQ.iDAk-6xC9ForjFuGCQtSZ0L9J-HicwBsyqwoS8RTJoE`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: total,
                "card-number": tarjeta,
                cvv: cvv,
                "expiration-month": mes,
                "expiration-year": ano,
                "full-name": "APPROVED",
                currency: "USD",
                description: "Transsaction Successfull",
                reference: "payment_id:25"
            })
        });
        const jsonData = await response.json();
        if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, 'token', (error, tokenAuthorized) => {
            if (error) {
                console.log(error);
            }
            if (tokenAuthorized) {
                req.user = tokenAuthorized.id;
                
                db.insertBuy(cliente_id, id, cantidad, total, fechaC, ipPaymentClient)
                    .thern(()=> {return next();})
                return next();
            }
        });
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.log(error)
    }
})



module.exports = router;
