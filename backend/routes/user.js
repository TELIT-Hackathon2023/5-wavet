const express = require('express')
const router = express.Router()


const { signupUser, loginUser, verifyUser, updateUserNames } = require('../controllers/userController')

router.post('/login', loginUser)
router.post('/signup', signupUser)
router.patch('/verify', verifyUser)
router.patch('/update', updateUserNames)




module.exports = router
