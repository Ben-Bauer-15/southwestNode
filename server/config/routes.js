var path = require('path')
var controller = require('../controllers/flights')
var puppeteer = require('../controllers/masterOfPuppets')

module.exports = function(app){
    
    app.get('/', function(req, res){
        res.sendFile(path.resolve("client/dist/client/index.html"))
    })

    app.post('/testDjango', function(req, res){
        controller.testDjango(req, res)
    })

    app.post('/startFareSearch', function(req, res){
        puppeteer.grabSiteData(req, res)
    })
}