const express = require('express');
const router = express.Router();
const client = require('../database/databasepg');

router.get('/', (res) => {
    const sql = 'SELECT * FROM car';
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/id', (req, res) => {
    const sql = `SELECT * FROM car WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/employee_id', (req, res) => {
    const sql = `SELECT * FROM car WHERE employee_id = ${req.params.employee_id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/evc', (req, res) => {
    const sql = `SELECT * FROM car WHERE evc = ${req.params.evc}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.post('/id', (req, res) => {
    const { employee_id, evc } = req.body;

    const sql = `
        INSERT INTO car (employee_id, evc)
        VALUES (${employee_id}, '${evc}')
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

router.delete('/id', (req, res) => {
    const sql = `DELETE FROM car WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;