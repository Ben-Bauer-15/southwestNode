import { Component, OnInit } from '@angular/core';
import { HttpService } from "./http.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';
  departAirportCode : String;
  arrivalAirportCode : String;
  returningDate : Date
  departingDate = new Date()
  today = new Date()
  maxFutureBooking : Date;
  email : String;
  phone : String;
  departAirportOptions : Array<String>;
  arriveAirportOptions : Array<String>;
  selectedDepartAirport : Boolean = false
  selectedArriveAirport : Boolean = false
  userEmail : String;
  userPhone : String;
  waitingForDjango = false;
  
  
  constructor(private _http : HttpService){

    this.maxFutureBooking = new Date(this.today.getFullYear(), this.today.getMonth() + 7, 30)
  }
  
  submit(){

    if (this.missingInfo()){
      alert("You haven't fully filled out the form!")
    }

    else if (this.departAirportCode == this.arrivalAirportCode){
      alert("Origin and destination airports cannot be the same")
    }

    else {
      this.waitingForDjango = true
      const dates = this.parseDateObjects()

      console.log(this.userEmail)
      let obs = this._http.startFareSearch({
        adultsCount : 1,
        departingDate : dates.depart, 
        returningDate : dates.return,
        destinationAirport : this.arrivalAirportCode, 
        originAirport : this.departAirportCode,
        userEmail : this.userEmail,
        userPhone : this.userPhone
      })
      obs.subscribe( (data : any) => {
        this.waitingForDjango = false
        if (data.message == 'Failure'){
          alert("Sorry, Southwest doesn't have routes for the given request. Please try a different query")
        }

        else if (data.message == 'Form error'){
          alert("Sorry, your phone number and/or email are not valid. Please try again")
        }

        else {
          alert("Success! We will send you an email and text if we find low fares")
        }
        
      })
    }
  }

  ngOnInit(){}

  fromKeyUp(){
    if (this.departAirportCode == ''){
      this.selectedDepartAirport = true
    }
    else {
      this.selectedDepartAirport = false
      let obs = this._http.getAirportSuggestions({input : this.departAirportCode})
      obs.subscribe((data : any) => {
        this.departAirportOptions = data.airports
      })
    }
  }
  
  toKeyUp(){
    if (this.arrivalAirportCode == ''){
      this.selectedArriveAirport = true
    }
    else {
      this.selectedArriveAirport = false
      let obs = this._http.getAirportSuggestions({input : this.arrivalAirportCode})
      obs.subscribe((data : any) => {
        this.arriveAirportOptions = data.airports
      })
    }
  }


  selectDepartOption(option){
    this.selectedDepartAirport = true
    this.departAirportCode = option.slice(option.length - 3, option.length)
  }
  
  selectArriveOption(option){
    this.selectedArriveAirport = true
    this.arrivalAirportCode = option.slice(option.length - 3, option.length)
  }

  parseDateObjects(){
    const departDate = this.pad(2, this.departingDate.getDate())
    const departMonth = this.pad(2, this.departingDate.getMonth() + 1)
    const year = this.today.getFullYear()

    const departString = year + "-" + departMonth + "-" + departDate
    

    const returnDate = this.pad(2, this.returningDate.getDate())
    const returnMonth = this.pad(2, this.returningDate.getMonth() + 1)
    const returnString = year + "-" + returnMonth + "-" + returnDate

    return {depart : departString, return : returnString}
  }

  pad(size, number){
    var s = String(number)
    while (s.length < (size || 2)) {
      s = "0" + s;
    }
    return s;
  }

  missingInfo(){
    // console.log(this.arrivalAirportCode, this.departAirportCode, this.returningDate)

    return !this.arrivalAirportCode || 
    !this.departAirportCode || 
    !this.returningDate ||
    !this.userEmail ||
    !this.userPhone

  }

}