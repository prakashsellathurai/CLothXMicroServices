const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

const apirouter = require('./../../../../functions/shared/utils/api/index')

app.use(cors({ origin: true }))
app.use(bodyParser.json())

app.use('/', apirouter)
// export the listening server not the raw server
module.exports = app.listen(8080, console.log('listening on port 8080'))
