const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite', ()=>{
    db.run('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, code INTEGER NOT NULL, name TEXT, model TEXT, description TEXT, price REAL NOT NULL, count INTEGER NOT NULL, category_id INTEGER, image_id INTEGER, FOREIGN KEY(category_id) REFERENCES categories(id), FOREIGN KEY(image_id) REFERENCES images(id))');
    db.run('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, product_id INTEGER, outstanding BOOLEAN NOT NULL, FOREIGN KEY(product_id) REFERENCES products(id))');
    db.run('CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT NOT NULL,password TEXT NOT NULL,address TEXT NOT NULL,country TEXT NOT NULL)');
    db.run('CREATE TABLE IF NOT EXISTS ventas (cliente_id TEXT NOT NULL,producto_id TEXT NOT NULL,cantidad INTEGER NOT NULL,total_pagado INTEGER NOT NULL,fecha TEXT NOT NULL,ip_cliente TEXT NOT NULL,FOREIGN KEY (cliente_id) REFERENCES cliente(id),FOREIGN KEY (producto_id) REFERENCES productos(id))')
});

module.exports = db;