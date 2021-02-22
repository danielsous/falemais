const express = require('express')
const setupRoutes = require('./config/routes')
const app = express()

app.use(express.json())

setupRoutes(app)

app.listen(9191, () => console.log('Server running...'))
