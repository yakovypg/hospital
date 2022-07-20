const db = require('../../database/db');

module.exports = async (req, res) => {
    const { doctorId, office, appointmentTime } = req.body;
    const values = [doctorId, office, appointmentTime];

    try {
        const newPost = await db.query('INSERT INTO Post (Doctor_Id, Office, AppointmentTime) VALUES ($1, $2, $3) RETURNING *', values);
        return res.json(newPost.rows);
    }
    catch (err) {
        return res.json({ error: err.message });
    }
};
