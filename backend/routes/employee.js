const express = require('express');
const router = express.Router();
const client = require('../database/databasepg');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM employee';
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/id/:id', (req, res) => {
    const sql = `SELECT * FROM employee WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/first_name', (req, res) => {
    const sql = `SELECT * FROM employee WHERE first_name = ${req.params.first_name}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/second_name', (req, res) => {
    const sql = `SELECT * FROM employee WHERE second_name = ${req.params.second_name}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/email', (req, res) => {
    const sql = `SELECT * FROM employee WHERE email = ${req.params.email}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/verified', (req, res) => {
    const sql = `SELECT * FROM employee WHERE verified = ${req.params.verified}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/rights', (req, res) => {
    const sql = `SELECT * FROM employee WHERE rights = ${req.params.rights}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.post('/id/:id', async (req, res) => {
    const { first_name, last_name, email, password, phone_number, verified, rights } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = `
        INSERT INTO employee (first_name, last_name, email, password, phone_number, verified, rights, created_at)
        VALUES ('${first_name}', '${last_name}', '${email}', '${hashedPassword}', '${phone_number}', ${verified}, ${rights}, NOW())
        RETURNING *;
    `;

    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(201).json(result.rows);
        }
    });
});

router.delete('/id/:id', (req, res) => {
    const sql = `DELETE FROM employee WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

module.exports = router;
//