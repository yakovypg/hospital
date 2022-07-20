module.exports = (req, res, next) => {
    if (req.session.isFreeSlotsSynchronized) {
        next();
    } else {
        res.redirect('/');
    }
};
