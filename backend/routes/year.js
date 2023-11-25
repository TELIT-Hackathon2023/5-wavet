const express = require('express')
const router = express.Router()
var client = require('../database/databasepg')


router.get('/id', (req, res) => {
    client.query(`SELECT * FROM id WHERE car = ${req.query.id}`, function (err, result) {
        if (err) {
            res.status(500).json({ error: err })

        } else {
            res.status(200).json(result)
        }

    });
})

router.post('/event', (req, res) => {
    const { year, event, date_time } = req.body
    console.log({ year, event, date_time });
    var sql = `INSERT INTO event (year,event,date_time) VALUES (${year},'${event}','${date_time}')`;
    client.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({ error: err.message })
            console.log(err);
        } else {
            var sql = `SELECT * FROM event WHERE ID = LAST_INSERT_ID()`;
            client.query(sql, function (err, result) {
                if (err) {
                    res.status(500).json({ error: err })
                } else {
                    res.status(200).json(result)
                }
            })
        }
    })

})

router.delete('/event/:id', (req, res) => {
    var sql = `DELETE FROM event WHERE ID = ${req.params.id}`;
    client.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({ error: err })
        } else {
            res.status(200).json(result)
        }
    })

})


router.get('/', (req, res) => {
    var sql = "SELECT * FROM year";
    client.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({ error: err })

        } else {
            res.status(200).json(result)
        }

    });
})

router.get('/current', (req, res) => {
    var sql = "SELECT * FROM year WHERE current = 1";
    client.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({ error: err })

        } else {
            res.status(200).json(result)
        }

    });
})

router.post('/current', (req, res) => {
    const { year } = req.body
    console.log(year);
    client.query(`UPDATE year SET current=0 WHERE current = 1`, function (err, result) {
        if (err) {
            res.status(500).json({ error: err })
            console.log(err);
        } else {
            client.query(`UPDATE year SET current=1 WHERE year = ${year}`, function (err, result) {
                if (err) {
                    res.status(500).json({ error: err })
                    console.log(err);
                } else {
                    client.query("SELECT * FROM year WHERE current = 1", function (err, result) {
                        if (err) {
                            res.status(500).json({ error: err })

                        } else {
                            res.status(200).json(result)
                        }

                    });

                }
            });

        }
    });
})



module.exports = router