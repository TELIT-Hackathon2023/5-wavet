const express = require('express');
const router = express.Router();
const client = require('../database/databasepg');
const notificationMail = require('../controllers/mail');
const mailOptions1 = require('../controllers/mail');

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

router.get('/employee_id/:id', (req, res) => {
    const employeeId = req.params.id;

    const sqlReservations = `SELECT * FROM reservation WHERE employee_id = $1`;
    client.query(sqlReservations, [employeeId], (reservationErr, reservationResult) => {
        if (reservationErr) {
            res.status(500).json({ error: reservationErr });
        } else {
            const reservations = reservationResult.rows;

            const reservationsWithCars = [];

            const fetchCarDetails = (index) => {
                if (index < reservations.length) {
                    const reservation = reservations[index];
                    const carId = reservation.car_id;

                    const sqlCar = `SELECT * FROM car WHERE id = $1`;
                    client.query(sqlCar, [carId], (carErr, carResult) => {
                        if (carErr) {
                            res.status(500).json({ error: carErr });
                        } else {
                            const carDetails = carResult.rows[0];

                            reservationsWithCars.push({
                                reservation: reservation,
                                car: carDetails,
                            });

                            fetchCarDetails(index + 1);
                        }
                    });
                } else {
                    res.status(200).json(reservationsWithCars);
                }
            };

            fetchCarDetails(0);
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
    const x = Number(startRange) / 1000
    const y = Number(endRange) / 1000
    const sql = `
        SELECT *, (SELECT  TO_TIMESTAMP(${x})) as tx FROM reservation
        WHERE  (start_time BETWEEN TO_TIMESTAMP(${x}) AND TO_TIMESTAMP(${y}))
        OR (end_time BETWEEN TO_TIMESTAMP(${x}) AND TO_TIMESTAMP(${y}))`;


    client.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

router.post('/', async (req, res) => {
    const { employee_id, start_time, end_time, status, spot_id, car_id } = req.body;

    console.log(start_time);
    console.log(end_time);

    const sql = `
    INSERT INTO reservation (employee_id, start_time, end_time, status, created_at, spot_id, car_id)
    VALUES ($1, TO_TIMESTAMP($2), TO_TIMESTAMP($3), $4, NOW(), $5, $6)
    RETURNING *;
`;


    client.query(sql, [employee_id, start_time / 1000, end_time / 1000, status, spot_id, car_id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
            console.log(err);
        } else {
            const reservationId = result.rows[0].id;
            //scheduleAction(reservationId, start_time, end_time);

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

function scheduleAction(reservationId, start_time, end_time) {
    const actionDate = new Date(start_time);
    const almostEnd = new Date(end_time);
    actionDate.setSeconds(actionDate.getSeconds() + 30);
    almostEnd.setMinutes(almostEnd.getMinutes() + 10);

    schedule.scheduleJob(actionDate, almostEnd, async () => {
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
                } else {
                    if (new Date() == almostEnd) {
                        sendNotificationMail(employee_id);
                    }
                }
            }
        });
    });
}

function sendNotificationMail(employee_id) {
    const emailQuery = `SELECT email FROM employee WHERE id = ${employee_id}`;
    client.query(emailQuery, (emailErr, emailResult) => {
        if (emailErr) {
            console.error(`Error fetching employee email: ${emailErr}`);
        } else {
            const email = emailResult.rows[0].email;
            notificationMail(email, mailOptions1);
        }
    });
}

module.exports = router;