import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AccountService } from './account.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class VerificateAuthService {

  private businessUrl: string = `${environment.endpoints.business}/HasAuthorization`;
  constructor(private _http: HttpClient, 
    private _utilityService: UtilityService,
    private _accountService: AccountService) { }

  async getAuthorization(): Promise<Observable<boolean>>{
    const httpOptions: HttpHeaders = (await this._utilityService.setHttpOptions());
    return this._http.get<boolean>(this.businessUrl, {headers: httpOptions}).pipe(catchError(error=>{
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
