const express = require('express');
const router = express.Router();
const client = require('../database/databasepg');
const bcrypt = require('bcrypt');

router.get('/employee', (res) => {
    const sql = 'SELECT * FROM employee';
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/employee/:id', (req, res) => {
    const sql = `SELECT * FROM employee WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/employee/:first_name', (req, res) => {
    const sql = `SELECT * FROM employee WHERE first_name = ${req.params.first_name}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/employee/:second_name', (req, res) => {
    const sql = `SELECT * FROM employee WHERE second_name = ${req.params.second_name}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/employee/:email', (req, res) => {
    const sql = `SELECT * FROM employee WHERE email = ${req.params.email}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/employee/:verified', (req, res) => {
    const sql = `SELECT * FROM employee WHERE verified = ${req.params.verified}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/employee/:rights', (req, res) => {
    const sql = `SELECT * FROM employee WHERE rights = ${req.params.rights}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    });
});

router.post('/employee', async (req, res) => {
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