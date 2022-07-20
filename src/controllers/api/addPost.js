const db = require('../../database/db');

module.exports = async (req, res) => {
    const { doctorId, office, appointmentTime } = req.body;
    const values = [doctorId, office, appointmentTime];

    try {
        const newPost = await db.query(
            'INSERT INTO Post (DoctorId, Office, AppointmentTime) VALUES ($1, $2, $3) RETURNING *',
            values,
        );

        delete req.session.adminError;
        return res.redirect('/admin');
    } catch (err) {
        req.session.adminError = err.message;
        return res.redirect('/admin');
    }
};
