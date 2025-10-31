const {Create,getAllCategory,getCategoryByID,update,deleteCategory ,getCategoriesPdf} = require('../controller/categoryController')

const express = require('express')

const router = express.Router()

router.get('/get-pdf' , getCategoriesPdf)

router.get('/',getAllCategory)
router.get('/:c_id',getCategoryByID)
router.post('/',Create)
router.put('/:id',update)
router.delete('/:id',deleteCategory)


module.exports = router