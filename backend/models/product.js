const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        p_id: {
            type: Number,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        qty: {
            type: Number,
            required: true
        },
        c_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        s_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true
        }



    }
)
module.exports =
    mongoose.model("product", productSchema)