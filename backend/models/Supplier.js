const mongoose = require('mongoose')

const supplierSchema = mongoose.Schema({
    s_id :{
        type:Number,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("Supplier",supplierSchema)