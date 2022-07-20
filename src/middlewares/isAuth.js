module.exports = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        req.session.loginError = 'You have to Login first';
        res.redirect('/login');
    }
};
