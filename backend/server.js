require('dotenv').config()

const express = require('express')
const userRoutes = require('./routes/user')

var client = require("./database/databasepg");
var cors = require('cors')

client.connect(() => {
    console.log("connected to postgre");
})

// express app
const app = express()

app.use(cors())
// middleware
app.use(express.json())


app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/user', userRoutes)


app.get('/x', (req, res) => {
    client.query(`SELECT * FROM player`, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err.sqlMessage })

        } else {
            res.status(200).json(result.rows)
            console.log(result);
        }

    });
})

// listen for requests
app.listen(process.env.PORT, () => {
    console.log('listening on port', process.env.PORT)
})

module.exports.client = client
