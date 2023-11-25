const express = require('express');
const router = express.Router();
const client = require('../database/databasepg');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM reservation';
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/id/:id', (req, res) => {
    const sql = `SELECT * FROM reservation WHERE id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/employee_id/:id', (req, res) => {
    const sql = `SELECT * FROM reservation WHERE employee_id = ${req.params.id}`;
    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.get('/in_range', (req, res) => {
    const { startRange, endRange, status } = req.query;

    const sql = `
        SELECT * FROM reservation
        WHERE status != 'canceled' 
        AND((start_time BETWEEN TO_TIMESTAMP(${startRange}) AND  TO_TIMESTAMP(${endRange})) OR (end_time BETWEEN  TO_TIMESTAMP(${startRange}) AND  TO_TIMESTAMP(${endRange})))`;

    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.post('/reservation', async (req, res) => {
    const { employee_id, car_id, start_time, end_time, status } = req.body;

    const sql = `
        INSERT INTO reservation (employee_id, start_time, end_time, status, created_at)
        VALUES (${employee_id}, '${car_id}', '${start_time}', '${end_time}', '${status}', NOW())
        RETURNING *;
    `;

    client.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            const reservationId = result.rows[0].id;
            scheduleAction(reservationId);

            res.status(201).json(result);
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

function scheduleAction(reservationId) {
    const actionDate = new Date();
    actionDate.setSeconds(actionDate.getSeconds() + 30);

    schedule.scheduleJob(actionDate, async () => {
        const statusQuery = `SELECT status FROM reservation WHERE id = ${reservationId}`;
        client.query(statusQuery, (statusErr, statusResult) => {
            if (statusErr) {
                console.error(`Chyba pri kontrole stavu rezervácie: ${statusErr}`);
            } else {
                const actualState = statusResult.rows[0].status;

                if (actualState !== 'active') {
                    const deleteQuery = `DELETE FROM reservation WHERE id = ${reservationId}`;
                    client.query(deleteQuery, (deleteErr, deleteResult) => {
                        if (deleteErr) {
                            console.error(`Chyba pri odstraňovaní rezervácie: ${deleteErr}`);
                        } else {
                            console.log(`Rezervácia ${reservationId} odstránená po 30 sekundách`);
                        }
                    });
                }
            }
        });
    });
}

module.exports = router;