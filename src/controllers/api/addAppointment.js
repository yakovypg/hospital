const db = require('../../database/db');

module.exports = async (req, res) => {
    const { firstName, lastName, passport, postId } = req.body;
    const patientData = [firstName, lastName, passport];

    try {
        const patientIdObj = await db.query('SELECT get_patient($1, $2, $3)', patientData);
        const patientId = patientIdObj.rows[0].get_patient; 

        const values = [patientId, postId];
        const newAppointment = await db.query('INSERT INTO Appointment (Patient_Id, Post_Id) VALUES ($1, $2) RETURNING *', values);
        
        return res.json(newAppointment.rows);
    }
    catch (err) {
        return res.json({ error: err.message });
    }
};
