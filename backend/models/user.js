const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {

        userID:{

            type:Number,
            unique:true
        },
        name: {
            type: String,
            required: true
        },
        email: { 
            type: String,
             required: true 
            },
        password: {
             type: String,
              required: true 
            },
        role:{
            type:String,
            enum:["Admin","Staff","Viewer"],
            default:"Staff"
        },
        active:{
            type:Boolean,
            required:true

        },
        craetedAt:{
            type:Date,
            default:Date.now
        } 


    }
 )
module.exports = mongoose.model("user",userSchema)