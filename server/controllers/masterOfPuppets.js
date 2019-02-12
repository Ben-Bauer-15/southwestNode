const puppeteer = require('puppeteer')
const fs = require('fs') 
const http = require('http')
const request = require('request')
const utils = require('./utils')
const flights = require('./flights')


module.exports = {

    grabSiteData : function(req, res){

        if (!req.body.tripType){
        request.post('http://18.188.177.136/validate', 
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
                    return false
                }
                
                else if (response.body == 'New user'){
                    flights.sendSignupMessage(req.body.userEmail, req.body.userPhone)
                }
                
                browse(req, res)
            })
        }
        else {
            browse(req, res)
        }
    }, 

    recheckFares : async function(req, res){
        const urlToVisit = utils.generateRoundtripUrl(1, req.body.departingDate, req.body.destinationAirport, req.body.originAirport, req.body.returningDate)
        
        const browser = await puppeteer.launch();
        const page = await browser.newPage()
        await page.goto(urlToVisit, {waitUntil: 'networkidle2'});
        const SWcontent = await page.content()
        await browser.close();

        request.post('http://127.0.0.1:8000/updateFareSearch', 
        { form: {siteData : SWcontent, 
                id : req.body.id}
             }, (err, response, body) => {

            if (err){
                console.log(err)
                res.json({message : err})
            }

            else {
                res.json({message : response.body})
            }
        })
    }
}


async function browse(req, res){
    var urlToVisit;


    if (req.body.tripType){

        urlToVisit = utils.generateOneWayUrl(1, req.body.departingDate, req.body.destinationAirport, req.body.originAirport)
        console.log(urlToVisit)

        const browser = await puppeteer.launch();
        const page = await browser.newPage()
        await page.goto(urlToVisit, {waitUntil: 'networkidle2'});
        const SWcontent = await page.content()
        await browser.close();
        res.json({message : SWcontent})
    }

    else {
        urlToVisit = utils.generateUrl(1, req.body.departingDate, req.body.destinationAirport, req.body.originAirport, req.body.returningDate)
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
            res.json({message : response.body})
            
        })
    }
}
