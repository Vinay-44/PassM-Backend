const router = require('express').Router()
const { jwtCheck } = require('../Middlewares/checkJwt')
const { addPassword, getPassword, deletePassword, updatePasswordDetails, updatePassword, dcryptPassword } = require('../Contollers/PassContols')


router.get('/', jwtCheck, getPassword)
router.post('/addPass', jwtCheck, addPassword)
router.delete('/delete/:id', jwtCheck, deletePassword)
router.patch('/updateDetails/:id', jwtCheck, updatePasswordDetails)
router.patch('/updatePassword/:id', jwtCheck, updatePassword)
router.post('/dcrypt/:id', jwtCheck, dcryptPassword)

module.exports = router