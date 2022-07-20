const db = require('../../database/db');

module.exports = async (req, res) => {
    const { id } = req.params;
    
    try {
        const appointment = await db.query('DELETE FROM Appointment WHERE Id = $1', [id]);
        delete req.session.adminError;
        
        return res.json(Boolean(appointment.rowCount));
    }
    catch (err) {
        req.session.adminError = err.message;
        return res.redirect('/admin');
    }
};
