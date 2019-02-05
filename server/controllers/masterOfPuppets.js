const puppeteer = require('puppeteer')
const fs = require('fs') 
const http = require('http')
const request = require('request')

// example format for SWA URL: https://www.southwest.com/air/booking/select.html?adultPassengersCount=1&departureDate=2019-02-01&departureTimeOfDay=ALL_DAY&destinationAirportCode=BOS&fareType=USD&originationAirportCode=DEN&passengerType=ADULT&reset=false&returnDate=2019-02-04&returnTimeOfDay=ALL_DAY&seniorPassengersCount=0&tripType=roundtrip


module.exports = {

    grabSiteData : async function(req, res){
        // console.log(req.body.adultsCount)

        const urlToVisit = 'https://www.southwest.com/air/booking/select.html?adultPassengersCount='+ req.body.adultsCount +'&departureDate='+ req.body.departingDate +'&departureTimeOfDay=ALL_DAY&destinationAirportCode='+ req.body.destinationAirport +'&fareType=USD&originationAirportCode='+ req.body.originAirport +'&passengerType=ADULT&promoCode=&reset=true&returnDate='+ req.body.returningDate +'&returnTimeOfDay=ALL_DAY&seniorPassengersCount=0&tripType=roundtrip'

        console.log(urlToVisit)

        const browser = await puppeteer.launch();
        const page = await browser.newPage()
        await page.goto(urlToVisit, {waitUntil: 'networkidle2'});
        const SWcontent = await page.content()
        await browser.close();

        // fs.writeFile('./backend/files/test.txt', SWcontent, function(err){
        //     if (err){
        //         console.log(err)
        //         return false
        //     }
        //     console.log("Successfully wrote the file")
        // })

        request.post('http://127.0.0.1:8000/parserTest', { form: {data : SWcontent} }, function(err, res, body){
            if (err){
                console.log(err)
                return false
            }
            console.log(res)
            
        })

        res.json({message : "Success!"})
    }
}

