const path = require('path');

const cors = require('cors');
const express = require('express');
const session = require('express-session');

const { PORT } = require('../config');

module.exports = app => {
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '../static')));

    app.use(
        cors({
            origin: `http://localhost:${PORT}`,
            credentials: true,
        }),
    );

    app.use(
        session({
            secret: 'secret',
            resave: false,
            saveUninitialized: false,
        }),
    );
};
