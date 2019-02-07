var path = require('path')
var controller = require('../controllers/flights')
var puppeteer = require('../controllers/masterOfPuppets')

module.exports = function(app){
    
    app.get('/', function(req, res){
        res.sendFile(path.resolve("client/dist/client/index.html"))
    })

    app.post('/startFareSearch', function(req, res){
        puppeteer.grabSiteData(req, res)
    })

    app.post('/getAirportSuggestions', function(req, res){
        controller.getAirportSuggestions(req, res)
    })

    app.post('/sendLowPriceText', function(req, res){
        controller.sendLowPriceText(req, res)
    })

    app.post('/recheckFares', function(req, res){
        puppeteer.recheckFares(req, res)
    })

}