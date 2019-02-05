var fs = require('fs')
var airports = []
var readline = require('readline').createInterface({
    input : fs.createReadStream('./server/controllers/airports.txt')
})
readline.on('line', function(line){
    airports.push(line)
})



const accountSid = require('./twilioAuth').accountSid
const authToken = require('./twilioAuth').authToken
const client = require('twilio')(accountSid, authToken)

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

    sendText : function(req, res){
        console.log('sending text')
        client.messages.create({
            to : '+18023565098',
            from : '+16037094836',
            body : 'Ahoy from twilio'
        })
        .then(message => res.json({message : "Success!"}))
        .done();

    }
}