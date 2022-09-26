const mongoose = require('mongoose')

const connectToMongo = () => {
    try {
        mongoose.connect(process.env.DB_URI, () => {
            console.log('DB connected successfully')
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectToMongo