const express = require('express');
const router = express.Router();
const client = require('../database/databasepg');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM spot';
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/id/:id', (req, res) => {
    const sql = `SELECT * FROM spot WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/name', (req, res) => {
    const sql = `SELECT * FROM spot WHERE name = ${req.params.name}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/is_free', (req, res) => {
    const sql = `SELECT * FROM spot WHERE is_free = ${req.params.is_free}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/current_car', (req, res) => {
    var sql = "SELECT * FROM spot WHERE current_car = 1";
    client.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({ error: err })

        } else {
            res.status(200).json(result)
        }

    });
})

router.delete('/id/:id', (req, res) => {
    const sql = `DELETE FROM spot WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

module.exports = router;