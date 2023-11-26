const express = require('express');
const router = express.Router();
const client = require('../database/databasepg');

// Function to execute a SQL query with parameters
const executeQuery = async (sql, values) => {
    try {
        const result = await client.query(sql, values);
        return result.rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};

// Function to update reservation status and delete if end time is reached
const updateReservationStatus = async (reservationId) => {
    try {
        // Check if reservation exists and is in the 'planned' state
        const checkReservationSql = 'SELECT * FROM reservation WHERE id = $1 AND status = $2';
        const checkReservationResult = await executeQuery(checkReservationSql, [reservationId, 'planned']);

        if (checkReservationResult.length === 0) {
            return { error: 'Reservation not found or not in the scheduled state' };
        }

        // Update reservation status to 'active'
        const updateReservationSql = 'UPDATE reservation SET status = $1 WHERE id = $2';
        await executeQuery(updateReservationSql, ['active', reservationId]);

        // Check if end time is reached
        const checkEndTimeSql = 'SELECT end_time FROM reservation WHERE id = $1';
        const endTimeResult = await executeQuery(checkEndTimeSql, [reservationId]);

        const currentTime = new Date();
        const endTime = new Date(endTimeResult[0].end_time);

        // If end time is reached, delete the reservation
        if (currentTime >= endTime) {
            const deleteReservationSql = 'DELETE FROM reservation WHERE id = $1';
            await executeQuery(deleteReservationSql, [reservationId]);
            return { message: 'Reservation status updated to active and reservation deleted' };
        }

        return { message: 'Reservation status updated to active' };
    } catch (error) {
        console.error('Error updating reservation status:', error);
        throw error;
    }
};

router.post('/reservation/:reservationId', async (req, res) => {
    const reservationId = req.params.reservationId;

    try {
        const result = await updateReservationStatus(reservationId);

        if (result.error) {
            return res.status(404).json({ error: result.error });
        }

        res.status(200).json({ message: result.message });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;