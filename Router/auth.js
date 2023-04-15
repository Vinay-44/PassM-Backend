const router = require('express').Router()
const { register, login, deleteAccount, updateAccount, updatePassword, logout, getMe } = require('../Contollers/AuthControls')
const { jwtCheck } = require('../Middlewares/checkJwt')
router.post('/register', register)

router.post('/login', login)

router.delete('/delete/', jwtCheck, deleteAccount)

router.patch('/update/:userid', jwtCheck, updateAccount)

router.patch('/passchange/:userid', jwtCheck, updatePassword)
router.post('/me', jwtCheck, getMe)
router.get('/logout', logout)
module.exports = router;