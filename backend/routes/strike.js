const express = require('express');
const router = express.Router();
const client = require('../database/databasepg');
const bcrypt = require('bcrypt');

router.get('/strike', (res) => {
    const sql = 'SELECT * FROM strike';
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/strike/:id', (req, res) => {
    const sql = `SELECT * FROM strike WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/strike/employee/:employee_id', (req, res) => {
    const sql = `SELECT * FROM strike WHERE employee_id = ${req.params.employee_id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.post('/strike', async (req, res) => {
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
            res.status(201).json(result);
        }
    });
});

router.delete('/strike/:id', (req, res) => {
    const sql = `DELETE FROM strike WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;