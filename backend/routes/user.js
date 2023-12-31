const express = require('express')
const router = express.Router()


const { signupUser, loginUser, verifyUser, updateUserNames, updatePassword } = require('../controllers/userController')

router.post('/login', loginUser)
router.post('/signup', signupUser)
router.patch('/verify', verifyUser)
router.patch('/update', updateUserNames)
router.patch('/password', updatePassword)




module.exports = router
