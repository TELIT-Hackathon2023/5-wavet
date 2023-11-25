const express = require('express');
const router = express.Router();
const client = require('../database/databasepg');
const bcrypt = require('bcrypt');

router.get('/reservation', (res) => {
    const sql = 'SELECT * FROM reservation';
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/reservation/:id', (req, res) => {
    const sql = `SELECT * FROM reservation WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/reservation/:employee_id', (req, res) => {
    const sql = `SELECT * FROM reservation WHERE employee_id = ${req.params.employee_id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/reservation/in_range', (req, res) => {
    const { startRange, endRange, status } = req.query;

    const sql = `
        SELECT * FROM reservation
        WHERE status = '${status}'
        AND (start_time >= '${startRange}' AND end_time <= '${endRange}')
    `;

    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.post('/reservation', async (req, res) => {
    const { employee_id, start_time, end_time, status } = req.body;
    // Assuming you have other fields like employee_id, start_time, end_time, status in your request body

    const sql = `
        INSERT INTO reservation (employee_id, start_time, end_time, status, created_at)
        VALUES (${employee_id}, '${start_time}', '${end_time}', '${status}', NOW())
        RETURNING *;
    `;

    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(201).json(result);
        }
    });
});

router.delete('/employee/:id', (req, res) => {
    const sql = `DELETE FROM employee WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;