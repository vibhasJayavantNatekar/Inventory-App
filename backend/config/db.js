// const mongoose = require('mongoose')

// function connect(){
// mongoose.connect('mongodb://localhost:27017/final-project')
// .then(()=>{
//      console.log("Database connected successfully...")
//     })
// .catch((err)=>
//     {
//         console.log(err)

//     })

// }
// module.exports = {connect}




const mongoose = require('mongoose')


 function connect() {
    mongoose.connect('mongodb://localhost:27017/finalproject')
        .then(() => { console.log("database is connected to db 🔥") })
        .catch((err) => { console.log(err) })
}
module.exports = {connect}