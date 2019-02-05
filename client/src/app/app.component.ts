import { Component } from '@angular/core';
import { HttpService } from "./http.service";
import { FormControl } from "@angular/forms";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';
  departAirportCode : String;
  arrivalAirportCode : String;
  returningDate : String;
  departingDate : String;
  email : String;
  phone : String;

  constructor(private _http : HttpService){}

  submit(){
    let obs = this._http.startFareSearch({
      adultsCount : 1,
      departingDate : this.departingDate, 
      returningDate : this.returningDate,
      destinationAirport : this.arrivalAirportCode, 
      originAirport : this.departAirportCode,
      })
    obs.subscribe( (data) => {
      console.log(data)
    })
    // console.log('line 31')
  }

}
