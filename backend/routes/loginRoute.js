const {login} = require('../controller/loginController')
const express = require('express')

const Router = express.Router()

Router.post('/',login)

module.exports = Router