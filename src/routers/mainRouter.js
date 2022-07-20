const express = require('express');

const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');

const mainRouter = new express.Router();

mainRouter.get('/home', isAuth, (req, res) => {
    res.render('home', { error: req.session.userError });
});

mainRouter.get('/admin', isAdmin, (req, res) => {
    res.render('admin', { error: req.session.adminError });
});

mainRouter.get('/login', (req, res) => {
    res.render('login', { error: req.session.loginError });
});

mainRouter.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email === 'admin@gmail.com' && password === 'admin') {
        req.session.isAuth = true;
        req.session.isAdmin = true;

        return res.redirect('/admin');
    } else if (email === 'user@gmail.com' && password === 'user') {
        req.session.isAuth = true;
        req.session.isAdmin = false;

        return res.redirect('/home');
    }

    req.session.loginError = 'Invalid Credentials';
    return res.redirect('/login');
});

mainRouter.post('/logout', (req, res) => {
    req.session.isAdmin = false;
    req.session.isAuth = false;

    delete req.session.loginError;
    delete req.session.adminError;
    delete req.session.userError;

    return res.redirect('/login');
});

mainRouter.use((req, res) => {
    res.send('Page not found');
});

module.exports = mainRouter;
