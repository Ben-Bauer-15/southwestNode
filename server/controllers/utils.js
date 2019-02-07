module.exports = {
    generateUrl : function(adultsCount, departingDate, destinationAirport, originAirport, returningDate){
        return 'https://www.southwest.com/air/booking/select.html?adultPassengersCount='+ adultsCount +'&departureDate='+ departingDate +'&departureTimeOfDay=ALL_DAY&destinationAirportCode='+ destinationAirport +'&fareType=USD&originationAirportCode='+ originAirport +'&passengerType=ADULT&promoCode=&reset=true&returnDate='+ returningDate +'&returnTimeOfDay=ALL_DAY&seniorPassengersCount=0&tripType=roundtrip'
    },

    generatePhoneNumber : function(input){
        const digits = input.split('-')
        var properFormat = '+1'

        for (var i = 0; i < digits.length; i++){
            properFormat += digits[i]
        }
        return properFormat
    }


}