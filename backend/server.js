require('dotenv').config()

const express = require('express')
const userRoutes = require('./routes/user')
const yearRoutes = require('./routes/year')
const spotRoutes = require('./routes/spot')
const carRoutes = require('./routes/car')
const reservationRoutes = require('./routes/reservation')
const employeeRoutes = require('./routes/employee')
const strikeRoutes = require('./routes/strike')
const strikeTypeRoutes = require('./routes/strikeType')
const gateRoutes = require('./routes/gate')

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
app.use('/api/year', yearRoutes)
app.use('/api/spot', spotRoutes)
app.use('/api/car', carRoutes)
app.use('/api/reservation', reservationRoutes)
app.use('/api/employee', employeeRoutes)
app.use('/api/strike', strikeRoutes)
app.use('/api/strikeType', strikeTypeRoutes)
app.use('/api/gate', gateRoutes)


// listen for requests
app.listen(process.env.PORT, () => {
    console.log('listening on port', process.env.PORT)
})

module.exports.client = client
