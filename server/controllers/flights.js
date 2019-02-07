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
const twilioNumber = require('./auth').twilioNumber
const MessagingResponse = require('twilio').twiml.MessagingResponse;



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
            from : twilioNumber,
            body : "Hello from the Southwest Low Fare Finder! We've detected that prices for your flight from " + req.body.originAirport + " to " + req.body.destinationAirport + " have dropped. Check your email (potentially in your spam folder) for a link to visit :)"
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
    },

    sendSignupMessage : function(email, phone){
        client.messages.create({
            to : phone,
            from : twilioNumber,
            body : "Thank you for signing up for the Southwest Low Fare Finder! We'll send you a text and email when we detect low prices"
        })
        .then(message => {return true})
        .done();

        const msg = {
            to: email,
            from: 'LowFareFinder@gmail.com',
            subject: 'Thank you!',
            text: "Hello from the Southwest Low Fare Finder! Thanks for signing up for our service. We'll send you a booking link if we find low prices."
          };
          sendGrid.send(msg);
    },

    testTwilResp : function(req, res){
        const response = new MessagingResponse()

        console.log(req.body.Body)

        response.message('The Robots are coming! Head for the hills!');

        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(response.toString());
    }
}