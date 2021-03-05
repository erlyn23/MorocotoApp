import { BusinessResponse } from './../core/commons/models/responses/BusinessResponse';
import { BusinessRequest } from './../core/commons/models/requests/business-request.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { environment } from 'src/environments/environment';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { UserResponse } from '../core/commons/models/responses/user-response';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const { Storage } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  private url: string = environment.endpoints.business;
  httpOptions: HttpHeaders;
  
  constructor(private _http: HttpClient, private _utilityService: UtilityService,
    private _router: Router) { }

  async saveBusiness(business: BusinessRequest): Promise<Observable<BusinessRequest>>{
    const httpOptions: HttpHeaders = await this.setHttpOptions();
    return this._http.post<BusinessRequest>(this.url, business, {headers: httpOptions}).pipe(catchError(error=>{
      this._utilityService.presentInfoAlert('Error al procesar la solicitud', error.error);
      return throwError(error);
    }));
  }

  async GetAllBusiness():Promise<Observable<BusinessResponse[]>>{
    
    const userDecoded = await this._utilityService.getUserDecoded();
    const httpOptions = await this.setHttpOptions();

   
     return this._http.get<BusinessResponse[]>(this.url+"/GetAllBusiness/"+userDecoded.Id, {headers:httpOptions}).pipe(catchError((error)=>{
      this._utilityService.presentInfoAlert('Error al obtener sus negocios, intentelo mas tarde.',error.error);
      return throwError(error.error);
    })); 
  }

  async setHttpOptions(): Promise<any>{
    const userString: string = (await Storage.get({key: 'user'})).value;
    const userObject: UserResponse = JSON.parse(userString);
    const token: string = userObject.token;
    return this.httpOptions = new HttpHeaders(
      {"content-type": "application/json",
      "Authorization": `Bearer ${token}`
      });
  }
}
