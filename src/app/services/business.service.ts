import { BusinessResponse } from 'src/app/core/commons/models/responses/BusinessResponse';
import { BusinessRequest } from './../core/commons/models/requests/business-request.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { environment } from 'src/environments/environment';
import { Plugins } from '@capacitor/core';
import { UserResponse } from '../core/commons/models/responses/user-response';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from './account.service';

const { Storage } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  private url: string = environment.endpoints.business;
  constructor(private _http: HttpClient, 
    private _utilityService: UtilityService,
    private _accountService: AccountService) { }

    async saveBusiness(business: BusinessRequest): Promise<Observable<BusinessRequest>>{
      const httpOptions: HttpHeaders =(await this._utilityService.setHttpOptions());
      return this._http.post<BusinessRequest>(this.url, business, {headers: httpOptions}).pipe(catchError(error=>{
        this._utilityService.presentInfoAlert('Error al obtener los negocios', error.error);
        return throwError(error);
      }));
    }

    async GetAllBusiness(): Promise<Observable<BusinessResponse[]>>{
      
      const userDecoded = (await this._utilityService.getDecodedUser());
      const httpOptions = (await this._utilityService.setHttpOptions());
      
      return this._http.get<BusinessResponse[]>(this.url+"/GetAllBusiness/"+userDecoded.Id, {headers:httpOptions}).pipe(catchError((error)=>{
        if(error.status === 401){
          this._utilityService.presentInfoAlert('No autorizado', 
          'El tiempo de sesión ha expirado, por favor vuelva a iniciar sesión',
          ()=>{
            this._accountService.signOut();
          });
        }
        return throwError(error.error);
      })); 
    }
}
