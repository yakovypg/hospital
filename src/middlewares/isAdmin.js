module.exports = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        req.session.loginError = 'You do not have access to this page';
        res.redirect('/login');
    }
};
