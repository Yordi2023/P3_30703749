const db = require('./connection');

let querys = {
    getProducts: 'SELECT * FROM products',
    getProductID: 'SELECT * FROM products WHERE id = ?',
    getImages: 'SELECT * FROM images',
    getCategories: 'SELECT * FROM categories',
    insertProduct: 'INSERT INTO products (code, name, model, description, price, count, category_id, image_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
    insertImage: 'INSERT INTO images (url, product_id, outstanding) VALUES(?, ?, ?)',
    updateProduct: 'UPDATE products SET code = ?, name = ?, model = ?, description = ?, price = ?, count = ?, category_id = ? WHERE id = ?',
    updateImage: 'UPDATE images SET url = ?, product_id = ?, outstanding = ? WHERE id = ?',
    deleteProduct: 'DELETE FROM products WHERE id = ?',
    deleteImageproduct: 'UPDATE products SET image_id = 0 WHERE image_id = ?',
    deleteImage: 'DELETE FROM images WHERE id = ?',
    getClientView: 'SELECT products.*, clients.*, ventas.*, ventas.cantidad FROM productos JOIN ventas ON products.id = ventas.product_id JOIN clients ON clients.id = ventas.cliente_id;',
    getPayment: 'SELECT p.*, i.* FROM products p JOIN images i ON p.id = i.id WHERE p.id = ?'
};

module.exports = {

    getPayment(id){
        return new Promise((resolve,reject) => {
            db.get(querys.getPayment,[id],(err,rows) => {
                if(err) reject(err);
                resolve(rows);
            })
        })
    },


    getProducts(){
        return new Promise((resolve, reject) => {
            db.all(querys.getProducts, (err, rows) => {
                if(err) reject(err);
                resolve(rows);
            })
        })
    },
    getProductID(id){
        return new Promise((resolve, reject) => {
            db.get(querys.getProductID, [id], (err, row) => {
                if(err) reject(err);
                resolve(row);
            })
        })
    },
    getImages(){
        return new Promise((resolve, reject) => {
            db.all(querys.getImages, (err, rows) => {
                if(err) reject(err);
                resolve(rows);
            })
        })
    },
    getCategories(){
        return new Promise((resolve, reject) => {
            db.all(querys.getCategories, (err, rows) => {
                if(err) reject(err);
                resolve(rows);
            })
        })
    },
    insertImage(url, product_id, outstanding){
        return new Promise((resolve, reject) => {
            db.run(querys.insertImage, [url, product_id, outstanding], (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    },    
    insertProduct(code, name, model, description, price, count, category_id, image_id){
        return new Promise((resolve, reject) => {
            db.run(querys.insertProduct, [code, name, model, description, price, count, category_id, image_id], (err) => {
                if(err) reject(err);
                resolve(this.lastID);
            })
        })
    },
    updateProduct(code, name, model, description, price, count, category_id, id){
        return new Promise((resolve, reject) => {
            db.run(querys.updateProduct, [code, name, model, description, price, count, category_id, id], (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    },
    updateImage(url, product_id, outstanding, id){
        return new Promise((resolve, reject) => {
            db.run(querys.updateImage, [url, product_id, outstanding, id], (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    },
    deleteProduct(id){
        return new Promise((resolve, reject) => {
            db.run(querys.deleteProduct, [id], (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    },
    deleteImageProduct(id){
        return new Promise((resolve, reject) => {
            db.run(querys.deleteImageproduct, [id], (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    },

    getClientView(){
        return new Promise((resolve,reject) => {
            db.all(querys.getClientView(),(err,row)=> {
                resolve(row)
            })
        })
    },
    deleteImage(id){
        return new Promise((resolve, reject) => {
            db.run(querys.deleteImage, [id], (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    },
    
    getUser(email, password){
        return new Promise((resolve, reject)=>{
            db.run(`SELECT * FROM clients WHERE email = ? AND password = ?`, [email, password], (err, row)=>{
                if(err) reject(err);
                resolve(row);
            });
    },
    insertUser(email, password, addres, country){
        db.run(`INSERT INTO clients(email,password,address,country) VALUES(?,?,?,?)`, [email, password, address, country], (err) => {
            if(err) reject(err);
                resolve();
        });
    }
}
