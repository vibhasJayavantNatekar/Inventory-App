const {getAllUsers ,getUsersById,DeleteUser,updateUser,CreateUser , getPdf ,getUsersExcel} = require('../controller/usercontroller.js')
const express = require('express')

const router = express.Router()

router.get('/get-pdf',getPdf)
router.get('/get-excel',getUsersExcel)


router.post('/',  CreateUser)
router.get('/',getAllUsers)
router.get('/:id',getUsersById)
router.put('/:id',updateUser)
router.delete('/:id',DeleteUser)




module.exports = router