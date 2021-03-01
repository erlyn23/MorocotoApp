import { UtilityService } from './utility.service';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {headers: new HttpHeaders({"content-type": "application/json"})}; 
@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private _router:Router,
                private _utility:UtilityService,
                private _httpClient:HttpClient) { }

    private url: string = environment.endpoints.business;

    async GetAllBusiness(accountNumber:string){

      //HERE WILL BE THE ACCOUNT NUMBER, I DON'T NOW HOW TO PUT IT IN YET
      let response = await this._httpClient.get(this.url+""); 

      return response;
    }

}
