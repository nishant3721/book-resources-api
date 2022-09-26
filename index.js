/* Loading the environment variables from the .env file. */
require('dotenv').config({ path: require('find-config')('.env') })
const express = require('express')
const connectToMongo = require('./config/db')
connectToMongo()
const app = express()
const cors = require('cors')

/* A middleware that parses the body of the request and makes it available in the req.body object. */
app.use(express.json())
/* Allowing the server to accept requests from other domains. */
app.use(cors())

/* Routing the requests to the appropriate route. */
app.get('/', (req, res) => {
    res.json({ status: 'Healthy', version: 'V1' })
})
app.use('/api/auth', require('./routes/auth'))
app.use('/api/book', require('./routes/book'))

app.listen(process.env.PORT, () => {
    console.log(`app is listening at http://localhost:${process.env.PORT}`)
})
