const User = require('../models/user')

async function login(req, res) {
    const { name, password } = req.body
    console.log("Received:", name, password) // debug line


    try {
        const user = await User.findOne({ name: name })
        console.log("Found user:", user) // debug line

        if (user) {
            if (user.password == password) {

                if(user.active){
                     res.status(200).json({user})
                }else{
                    res.json("Inactive")
                }
            }else {
                res.json("Invalid")
            }

        } else {
            res.json("Failed")

        }

    } catch (error) {

        res.status(500).json(error)

    }

}

module.exports = { login }