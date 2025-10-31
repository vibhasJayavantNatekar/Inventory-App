const express = require('express')

const {getSupplier,getSupplierById,create,updateSupplier,deleteSupplier,getSuppliersPdf , getSuppliersExcel} = require('../controller/SupplierController')

const router = express.Router()

router.get('/get-pdf',getSuppliersPdf)

router.get('/get-excel',getSuppliersExcel)


router.get('/', getSupplier)

router.get('/:id',getSupplierById)

router.post('/',create)

router.put('/:id',updateSupplier)

router.delete('/:id' , deleteSupplier)

module.exports = router