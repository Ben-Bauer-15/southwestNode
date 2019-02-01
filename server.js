const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(express.static(__dirname + '/client/dist/client'))
app.use(bodyParser.json())
app.use(bodyParser({extended : true}))

const server = app.listen(4000, () => {
    console.log('Listening on port 4000')
})

require('./server/config/routes')(app)

