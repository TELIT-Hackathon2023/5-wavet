const express = require('express')
const router = express.Router()


const { signupUser, loginUser, verifyUser } = require('../controllers/userController')

router.post('/login', loginUser)
router.post('/signup', signupUser)
router.patch('/verify', verifyUser)




module.exports = router
