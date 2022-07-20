const db = require('../../database/db');

module.exports = async (req, res) => {
    try {
        const posts = await db.query('SELECT * FROM Post WHERE Id NOT IN (SELECT Post_Id FROM Appointment)');
        return res.json(posts.rows);
    }
    catch (err) {
        return res.json({ error: err.message });
    }
};
