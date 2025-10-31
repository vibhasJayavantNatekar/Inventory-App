
const mongoose =require('mongoose')

const categorySchema= mongoose.Schema({
    c_id:{type:Number,
        required:true,
        unique:true

    },
    name:{
        type:String,
        required:true
    }
    ,
    description:{
        type:String,
        required:true
    }
})

module.exports= mongoose.model('Category' ,categorySchema)