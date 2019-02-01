const express = require('express')
const app = express()
var path = require('path')
var http = require('http')
app.use(express.static(__dirname + '/client/dist/client'))


const server = app.listen(5000, () => {
    console.log('Listening on port 5000')
})

app.get('/', function(req, res){
    res.sendFile(path.resolve(""))
})

app.get('/test', function(req, res){
    http.get('http://127.0.0.1:8000', (resp) => {
        let data = ''
        resp.on('data', (chunk) => {
            // console.log(chunk)
            data += chunk
            console.log(data)
        })

        resp.on('end', () => {
            // console.log(data);
            res.json({message : data})
        });
    })
})