const express = require('express');
const router = express.Router();
const client = require('../database/databasepg');

router.post('/pass-through/:reservationId', async (req, res) => {
    const reservationId = req.params.reservationId;

    try {
        const checkReservationSql = `SELECT * FROM reservation WHERE id = ${reservationId} AND status = 'planned'`;
        const checkReservationResult = await client.query(checkReservationSql);

        if (checkReservationResult.rows.length === 0) {
            return res.status(404).json({ error: 'Reservation not found or not in the scheduled state' });
        }

        const updateReservationSql = `UPDATE reservation SET status = 'active' WHERE id = ${reservationId}`;
        await client.query(updateReservationSql);

        res.status(200).json({ message: 'Reservation status updated to active' });
    } catch (error) {
        console.error('Error updating reservation status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;