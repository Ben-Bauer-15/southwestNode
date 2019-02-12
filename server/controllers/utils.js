// example SWA one way: https://www.southwest.com/air/booking/select.html?int=HOMEQBOMAIR&adultPassengersCount=1&departureDate=2019-03-19&departureTimeOfDay=ALL_DAY&destinationAirportCode=BOS&fareType=USD&originationAirportCode=DEN&passengerType=ADULT&promoCode=&reset=true&returnDate=&returnTimeOfDay=ALL_DAY&seniorPassengersCount=0&tripType=oneway


// example roundtrip url : https://www.southwest.com/air/booking/select.html?int=HOMEQBOMAIR&adultPassengersCount=1&departureDate=2019-03-19&departureTimeOfDay=ALL_DAY&destinationAirportCode=BOS&fareType=USD&originationAirportCode=DEN&passengerType=ADULT&promoCode=&reset=true&returnDate=2019-04-24&returnTimeOfDay=ALL_DAY&seniorPassengersCount=0&tripType=roundtrip



module.exports = {
    generateRoundtripUrl : function(adultsCount, departingDate, destinationAirport, originAirport, returningDate){
        return 'https://www.southwest.com/air/booking/select.html?adultPassengersCount='+ adultsCount +'&departureDate='+ departingDate +'&departureTimeOfDay=ALL_DAY&destinationAirportCode='+ destinationAirport +'&fareType=USD&originationAirportCode='+ originAirport +'&passengerType=ADULT&promoCode=&reset=true&returnDate='+ returningDate +'&returnTimeOfDay=ALL_DAY&seniorPassengersCount=0&tripType=roundtrip'
    },

    generateTwilioPhoneNumber : function(input){
        const digits = input.split('-')
        var properFormat = '+1'

        for (var i = 0; i < digits.length; i++){
            properFormat += digits[i]
        }
        return properFormat
    },

    generateDjangoPhoneNumber : function(input){
        const areaCode = input.slice(2,5)
        const localCode = input.slice(5,8)
        const number = input.slice(8,12)
        var django = areaCode + '-' + localCode + '-' + number

        return django
    },

    generateOneWayUrl : function(adultsCount, departingDate, destinationAirport, originAirport){
        return 'https://www.southwest.com/air/booking/select.html?int=HOMEQBOMAIR&adultPassengersCount=' + adultsCount +'&departureDate=' + departingDate + '&departureTimeOfDay=ALL_DAY&destinationAirportCode=' + destinationAirport + '&fareType=USD&originationAirportCode=' + originAirport + '&passengerType=ADULT&promoCode=&reset=true&returnDate=&returnTimeOfDay=ALL_DAY&seniorPassengersCount=0&tripType=oneway'
    }

}