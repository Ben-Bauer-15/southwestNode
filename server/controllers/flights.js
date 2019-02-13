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

const ID_REGEX = new RegExp('^\\d+$')


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
        const url = utils.generateRoundtripUrl(1, req.body.departingDate, req.body.destinationAirport, req.body.originAirport, req.body.returningDate)

        const userPhone = utils.generateTwilioPhoneNumber(req.body.userPhone)
        const userEmail = req.body.userEmail

        client.messages.create({
            to : userPhone,
            from : twilioNumber,
            body : "Hello from the Southwest Low Fare Finder! We've detected that prices for your flight from " + req.body.originAirport + " to " + req.body.destinationAirport + " have dropped. Check your email (potentially in your spam folder) for a link to visit :) \n Reply HALT to tell us to cancel this search",
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

    twilioIncoming : function(req, res){
        const response = new MessagingResponse()

        const twilioPhone = req.body.From
        console.log("twilio incoming message : ", req.body)
        const djangoPhone = utils.generateDjangoPhoneNumber(twilioPhone)

        if (ID_REGEX.test(req.body.Body)){
            request.post('http://127.0.0.1:4000/delete',
            {form : {searchID : req.body.Body, userPhone : djangoPhone}}, (err, djangoResponse, body) => {
                var clientMsg;
                if (err){
                    console.log(err)
                    return false
                }

                else if (djangoResponse.body == 'Invalid search ID'){
                    clientMsg = 'Invalid search ID. Please try again.'
                    response.message(clientMsg)
                    res.writeHead(200, {'Content-Type': 'text/xml'})
                    res.end(response.toString())
                }

                else if (djangoResponse.body == 'Success'){
                    clientMsg = 'Your search has been discontinued'
                    response.message(clientMsg)
                    res.writeHead(200, {'Content-Type': 'text/xml'})
                    res.end(response.toString())
                }
            })
        }

        else if (req.body.Body == 'HALT'){
            
            request.post('http://127.0.0.1:4000/findSearches', 
            { form: {userPhone : djangoPhone} }, (err, djangoResponse, body) => {
    
            if (err){
                console.log(err)
                return false
            }
            
            else if (djangoResponse.body == 'No searches found'){
                response.message("Sorry, we couldn't find any searches under this number")
                res.writeHead(200, {'Content-Type': 'text/xml'})
                res.end(response.toString())
            }

            else {

                const searches = JSON.parse(djangoResponse.body)
                var clientMsg = 'Tell us which search ID you would like to cancel: \n'
                
                for (var i in searches){
                    clientMsg += (i + ' : ' + searches[i][0] + ' -> ' + searches[i][1] + ' from ' + searches[i][2] + ' to ' + searches[i][3] + '\n')
                }
                
                response.message(clientMsg)
                res.writeHead(200, {'Content-Type': 'text/xml'})
                res.end(response.toString())
            }
            
        })
    }
        
        else {
                const clientMsg = 'Invalid response. Please try again.'
                response.message(clientMsg)
                res.writeHead(200, {'Content-Type': 'text/xml'})
                res.end(response.toString())
                
            }
        }
}