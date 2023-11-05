const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite', ()=>{
    db.run('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, code INTEGER NOT NULL, name TEXT, model TEXT, description TEXT, price REAL NOT NULL, count INTEGER NOT NULL, category_id INTEGER, FOREIGN KEY(category_id) REFERENCES categories(id))');
    db.run('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, product_id INTEGER, outstanding BOOLEAN NOT NULL, FOREIGN KEY(product_id) REFERENCES products(id))');
});

module.exports = db;