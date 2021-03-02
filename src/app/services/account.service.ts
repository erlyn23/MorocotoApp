import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRequest } from '../core/commons/models/requests/user-request.interface';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { EmailVerificationResponse } from '../core/commons/models/responses/email-verification-response.interface';
import { ActivateAccountRequest } from '../core/commons/models/requests/activate-account-request.interface';
import { catchError, map } from 'rxjs/operators';
import { SendEmailRequest } from '../core/commons/models/requests/send-email-request.interface';
import { UserResponse } from '../core/commons/models/responses/user-response';
import { UtilityService } from './utility.service';
import { AuthRequest } from '../core/commons/models/requests/auth-request';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { ChangePasswordRequest } from '../core/commons/models/requests/change-password-request.interface';

const { Storage } = Plugins;
 

const httpOptions = {headers: new HttpHeaders({"content-type": "application/json"})}; 

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private url: string = environment.endpoints.account;
  
  private userSubject: BehaviorSubject<UserResponse>;
  public user$: Observable<UserResponse>;

  public get getUserData(): UserResponse{
    if(this.userSubject){
      return this.userSubject.value;
    }
  }

  constructor(private _http: HttpClient, 
    private _utilityService: UtilityService, 
    private _router: Router) {
      this.getUserDataFromStorage().then((user)=>{
        this.userSubject = new BehaviorSubject<UserResponse>(JSON.parse(user));
        this.user$ = this.userSubject.asObservable();
      });
   }

   private async getUserDataFromStorage(){
     return (await Storage.get({key: 'user'})).value;
   }

  registerUser(userRequest: UserRequest): Observable<number>{


    return this._http.post<number>(`${this.url}`, userRequest, httpOptions).pipe(catchError((error)=>{

      this._utilityService.presentInfoAlert('Error al procesar solicitud',error.error);
      return throwError(error.error);
    }));
  }

  sendVerificationEmail(userEmail: string): Observable<EmailVerificationResponse>{
    const model: SendEmailRequest = { identificationDocument: '', userEmail: userEmail };
    return this._http.post<EmailVerificationResponse>(`${this.url}/SendEmailVerificationWithEmail`, model, httpOptions).pipe(catchError((error)=>{
      this._utilityService.presentInfoAlert('Error al procesar solicitud',error.error);
      return throwError(error.error);
    }));
  }

  sendVerificationEmailWithIdentificationDocument(identificationDocument: string): Observable<EmailVerificationResponse>{
    const model: SendEmailRequest = { identificationDocument: identificationDocument, userEmail: '' }
    return this._http.post<EmailVerificationResponse>(`${this.url}/SendEmailVerificationWithIdentificationDocument`, model, httpOptions).pipe(catchError((error)=>{
      this._utilityService.presentInfoAlert('Error al procesar solicitud',error.error);
      return throwError(error.error);
    }));
  }

  activateAccount(activateAccountRequest: ActivateAccountRequest): Observable<ActivateAccountRequest>{
    return this._http.patch<ActivateAccountRequest>(`${this.url}/VerifyAccount`, activateAccountRequest, httpOptions).pipe(catchError((error)=>{
      this._utilityService.presentInfoAlert('Error al procesar solicitud',error.error);
      return throwError(error.error);
    }));;
  }

  signIn(authRequest: AuthRequest): Observable<UserResponse>{
    return this._http.post<UserResponse>(`${this.url}/SignIn`, authRequest, httpOptions).pipe(
      map(response => {
        if(response){
          const user: UserResponse = response;
          Storage.set({key: 'user', value: JSON.stringify(user)});
          this.userSubject.next(user);
        }
        return response;
      }),catchError((error)=>{
        this._utilityService.presentInfoAlert('Error al procesar solicitud',error.error);
        return throwError(error.error);
      })
    );
  }

  signOut(){
    Storage.remove({key: 'user'});
    this.userSubject.next(null);
    this._router.navigate(['/login']);
  }

  changePassword(changePasswordRequest: ChangePasswordRequest): Observable<ChangePasswordRequest>{
    return this._http.patch<ChangePasswordRequest>(`${this.url}/ChangePassword`, changePasswordRequest, httpOptions)
    .pipe(catchError((error)=>{
        this._utilityService.presentInfoAlert('Error al procesar solicitud',error.error);
        return throwError(error.error);
      }));
  }
}
