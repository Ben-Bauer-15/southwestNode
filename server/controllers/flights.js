var fs = require('fs')
var airports = []
var readline = require('readline').createInterface({
    input : fs.createReadStream('./server/controllers/airports.txt')
})
readline.on('line', function(line){
    airports.push(line)
})

const accountSid = require('./auth').accountSid
const authToken = require('./auth').authToken
const sendGridAPIKey = require('./auth').sendGridKey
const client = require('twilio')(accountSid, authToken)
const request = require('request')
const utils = require('./utils')
const sendGrid = require('@sendgrid/mail')
sendGrid.setApiKey(sendGridAPIKey)


module.exports  = {

    getAirportSuggestions : function(req, res){
        try{
            const rawSub = req.body.input
            const allCaps = rawSub.toUpperCase()
            const firstCharCaps = rawSub.charAt(0).toUpperCase() + rawSub.slice(1, rawSub.length)
            
            var suggestions = []
            
            for (var i = 0; i < airports.length; i++){
                const airportName = airports[i]
                if (airportName.includes(rawSub) || airportName.includes(allCaps) || airportName.includes(firstCharCaps)){
                    suggestions.push(airportName)
                }
            }
            res.json({airports : suggestions})
        }
        catch{
            res.json({message : "Failure"})
        }
    },

    sendLowPriceText : function(req, res){
        const url = utils.generateUrl(1, req.body.departingDate, req.body.destinationAirport, req.body.originAirport, req.body.returningDate)

        const userPhone = utils.generatePhoneNumber(req.body.userPhone)

        const userEmail = req.body.userEmail

        client.messages.create({
            to : userPhone,
            from : '+16037094836',
            body : "Hello from the Southwest Low Fare Finder! We've detected that prices for your flight from " + req.body.originAirport + " to " + req.body.destinationAirport + " have dropped. Check your email (potentially in your spam folder) for a link to visit :) "
        })
        .then(message => {return true})
        .done();

        const msg = {
            to: userEmail,
            from: 'LowFareFinder@gmail.com',
            subject: 'Low fare alert!',
            text: "Hello from the Southwest Low Fare Finder! We've detected a drop in prices. Visit this link to view your booking options " + url
          };
          sendGrid.send(msg);


        res.json({message : "Success"})

    }
}