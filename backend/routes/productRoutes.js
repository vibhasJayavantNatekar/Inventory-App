const { createProduct, getProducts,getProductById, update, deleteProduct , getProductsPdf , getProductsExcel} = require('../controller/productController')


const express = require('express')
const Router = express.Router()

Router.get('/get-pdf', getProductsPdf)
Router.get('/get-excel', getProductsExcel)


Router.get('/', getProducts)
Router.get('/:id', getProductById)
Router.post('/', createProduct)
Router.put('/:id', update)
Router.delete('/:id', deleteProduct)



module.exports= Router