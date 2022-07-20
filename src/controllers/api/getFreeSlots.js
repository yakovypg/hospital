const db = require('../../database/db');

module.exports = async (req, res) => {
    try {
        const posts = await db.query('SELECT * FROM Post WHERE Id NOT IN (SELECT PostId FROM Appointment)');
        delete req.session.userError;

        req.session.isFreeSlotsSynchronized = true;
        req.session.freeSlots = posts.rows;

        return res.redirect('/api/freeSlots');
    }
    catch (err) {
        req.session.userError = err.message;
        return res.redirect('/home');
    }
};
