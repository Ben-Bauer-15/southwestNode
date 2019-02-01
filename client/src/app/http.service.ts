import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http : HttpClient) { }

  testDjango(obj){
    return this._http.post('/testDjango', obj)
  }

  startFareSearch(obj){
    return this._http.post('/startFareSearch', obj)
  }
}
