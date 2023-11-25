const express = require('express');
const router = express.Router();
const client = require('../database/databasepg');
const bcrypt = require('bcrypt');

router.get('/', (res) => {
    const sql = 'SELECT * FROM strike_type';
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/id', (req, res) => {
    const sql = `SELECT * FROM strike_type WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.post('/', async (req, res) => {
    const { description, severity } = req.body;

    const sql = `
        INSERT INTO strike_type (description, severity)
        VALUES ('${description}', ${severity})
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
    const sql = `DELETE FROM strike_type WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;