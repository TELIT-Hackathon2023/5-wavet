const express = require('express');
const router = express.Router();
const client = require('../database/databasepg');
const mailOptions3 = require('../controllers/mail');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM strike';
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/id/:id', (req, res) => {
    const sql = `SELECT * FROM strike WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/', (req, res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sql = 'SELECT * FROM strike WHERE created_at >= $1';
    client.query(sql, [thirtyDaysAgo], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/employee_id/:id', (req, res) => {
    const sql = `SELECT * FROM strike WHERE employee_id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.post('/', async (req, res) => {
    const { employee_id, strike_type } = req.body;

    const sql = `
        INSERT INTO strike (employee_id, strike_type)
        VALUES (${employee_id}, ${strike_type})
        RETURNING *;
    `;

    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            sendNotificationMail(employee_id);
            res.status(201).json(result);
        }
    });
});

router.delete('/id/:id', (req, res) => {
    const sql = `DELETE FROM strike WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

function sendNotificationMail(employee_id) {
    const strikeQuery = `SELECT strike_type FROM strike WHERE employee_id = ${employee_id}`;
    client.query(strikeQuery, (strikeErr, strikeResult) => {
        if (strikeErr) {
            console.error(`Error fetching strike type: ${strikeErr}`);
        } else {
            const strikeType = strikeResult.rows[0].strike_type;
            const descriptionQuery = `SELECT description FROM strike_type WHERE id = ${strikeType}`;

            client.query(descriptionQuery, (descErr, descResult) => {
                if (descErr) {
                    console.error(`Error fetching strike description: ${descErr}`);
                } else {
                    const description = descResult.rows[0].description;
                    const emailQuery = `SELECT email FROM employee WHERE id = ${employee_id}`;
                    client.query(emailQuery, (emailErr, emailResult) => {
                        if (emailErr) {
                            console.error(`Error fetching employee email: ${emailErr}`);
                        } else {
                            const email = emailResult.rows[0].email;
                            notificationMail(email, mailOptions3(email, description));
                        }
                    });
                }
            });
        }
    });
}

module.exports = router;