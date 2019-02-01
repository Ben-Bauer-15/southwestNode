const puppeteer = require('puppeteer')
const fs = require('fs') 


async function launchBrowser(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.goto('https://www.southwest.com/air/booking/select.html?adultPassengersCount=1&departureDate=2019-02-13&departureTimeOfDay=ALL_DAY&destinationAirportCode=BOS&fareType=USD&originationAirportCode=SJC&passengerType=ADULT&promoCode=&reset=true&returnDate=2019-03-08&returnTimeOfDay=ALL_DAY&seniorPassengersCount=0&tripType=roundtrip', {waitUntil: 'networkidle2'});
    const content = await page.content()
    fs.writeFile('contents.txt', content, function(err){
        if (err){
            console.log(err)
            return false
        }
        console.log('file was successfully written')
    })
    await browser.close();
}

launchBrowser()
