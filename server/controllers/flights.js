var http = require('http')
var fs = require('fs')
var airports = []
var readline = require('readline').createInterface({
    input : fs.createReadStream('./server/controllers/airports.txt')
})
readline.on('line', function(line){
    airports.push(line)
})


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
            
    }
}