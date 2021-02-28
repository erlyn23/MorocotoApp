import { environment } from './../../environments/environment.prod';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {headers: new HttpHeaders({"content-type": "application/json"})}; 
@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor() { }

  //private url: string = environment.endpoints.business;
}
