const db = require('../../database/db');

module.exports = async (req, res) => {
    const { firstName, lastName, passport, postId } = req.body;
    const patientData = [firstName, lastName, passport];

    try {
        const patientIdObj = await db.query('SELECT get_patient($1, $2, $3)', patientData);
        const patientId = patientIdObj.rows[0].get_patient;

        const values = [patientId, postId];
        const newAppointment = await db.query(
            'INSERT INTO Appointment (PatientId, PostId) VALUES ($1, $2) RETURNING *',
            values,
        );

        delete req.session.userError;
        return res.redirect('/home');
    } catch (err) {
        req.session.userError = err.message;
        return res.redirect('/home');
    }
};
