const db = require('./connection');

let querys = {
    getProducts: 'SELECT * FROM products',
    getProductID: 'SELECT * FROM products WHERE id = ?',
    getImages: 'SELECT * FROM images',
    getCategories: 'SELECT * FROM categories',
    insertProduct: 'INSERT INTO products (code, name, model, description, price, count, category_id) VALUES(?, ?, ?, ?, ?, ?, ?)',
    insertImage: 'INSERT INTO images (url, product_id, outstanding) VALUES(?, ?, ?)',
    updateProduct: 'UPDATE products SET code = ?, name = ?, model = ?, description = ?, price = ?, count = ?, category_id = ? WHERE id = ?',
    updateImage: 'UPDATE images SET url = ?, product_id = ?, outstanding = ? WHERE id = ?',
    deleteProduct: 'DELETE FROM products WHERE id = ?',
    deleteImage: 'DELETE FROM images WHERE id = ?'
};

module.exports = {
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
    insertProduct(code, name, model, description, price, count, category_id){
        return new Promise((resolve, reject) => {
            db.run(querys.insertProduct, [code, name, model, description, price, count, category_id], (err) => {
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
    deleteImage(id){
        return new Promise((resolve, reject) => {
            db.run(querys.deleteImage, [id], (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    }
}