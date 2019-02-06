const puppeteer = require('puppeteer')
const fs = require('fs') 
const http = require('http')
const request = require('request')

// example SWA URL: https://www.southwest.com/air/booking/select.html?adultPassengersCount=1&departureDate=2019-02-01&departureTimeOfDay=ALL_DAY&destinationAirportCode=BOS&fareType=USD&originationAirportCode=DEN&passengerType=ADULT&reset=false&returnDate=2019-02-04&returnTimeOfDay=ALL_DAY&seniorPassengersCount=0&tripType=roundtrip


module.exports = {

    grabSiteData : function(req, res){

        request.post('http://127.0.0.1:8000/validate', 
            { form : 
                {userEmail : req.body.userEmail,
                userPhone : req.body.userPhone}},

            (err, response, body) => {
                if (err){
                    console.log(err)
                    return false
                }
                else if (response.body == 'Form error'){
                    res.json({message : response.body})
                }

                else {
                    browse(req, res)
                }
            })

    }
}


async function browse(req, res){
    const urlToVisit = 'https://www.southwest.com/air/booking/select.html?adultPassengersCount='+ req.body.adultsCount +'&departureDate='+ req.body.departingDate +'&departureTimeOfDay=ALL_DAY&destinationAirportCode='+ req.body.destinationAirport +'&fareType=USD&originationAirportCode='+ req.body.originAirport +'&passengerType=ADULT&promoCode=&reset=true&returnDate='+ req.body.returningDate +'&returnTimeOfDay=ALL_DAY&seniorPassengersCount=0&tripType=roundtrip'

    // console.log(req.body.userEmail)
    console.log(urlToVisit)

    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.goto(urlToVisit, {waitUntil: 'networkidle2'});
    const SWcontent = await page.content()
    await browser.close();

    request.post('http://127.0.0.1:8000/startFareSearch', 
        { form: {siteData : SWcontent, 
                userEmail : req.body.userEmail,
                userPhone : req.body.userPhone,
                originAirport : req.body.originAirport,
                destinationAirport : req.body.destinationAirport,
                departingDate : req.body.departingDate,
                returningDate : req.body.returningDate
        } }, (err, response, body) => {

        if (err){
            console.log(err)
            return false
        }
        // console.log(response.body)
        res.json({message : response.body})
        
    })
}

