const express = require('express')

const cors = require('cors')
const { connect } = require('./config/db.js')
const Userrouter = require('./routes/userRouts.js');
const ProductRouter = require('./routes/productRoutes.js')
const CategoryRouter = require('./routes/categoryRoutes.js')
const supplierRoutes = require('./routes/supplierRoutes.js')
const loginRoute = require('./routes/loginRoute.js')
const reportRoute = require("./routes/reportRoutes")



const app = express();
const port = process.env.port || 4000

app.use(express.json())

connect()
app.use(cors())


app.use('/api/login',loginRoute)

app.use('/api/users',
    Userrouter
)

app.use('/api/products',
    ProductRouter
)

app.use('/api/categories',
    CategoryRouter)


app.use('/api/suppliers', supplierRoutes)


app.use("/api/reports",  reportRoute);

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

