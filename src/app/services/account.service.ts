import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRequest } from '../core/commons/models/requests/user-request.interface';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { EmailVerificationResponse } from '../core/commons/models/responses/email-verification-response.interface';
import { ActivateAccountRequest } from '../core/commons/models/requests/activate-account-request.interface';
import { retry, catchError, map } from 'rxjs/operators';
import { SendEmailRequest } from '../core/commons/models/requests/send-email-request.interface';
import { UserResponse } from '../core/commons/models/responses/user-response';
import { UtilityService } from './utility.service';
import { AuthRequest } from '../core/commons/models/requests/auth-request';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';

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
    return this._http.post<number>(`${this.url}`, userRequest, httpOptions).pipe(retry(1), catchError((error)=>{
      console.log(error);
      this._utilityService.presentInfoAlert('Error al procesar solicitud',error.error.Message);
      return throwError(error.message);
    }));
  }

  sendVerificationEmail(userEmail: string): Observable<EmailVerificationResponse>{
    const model: SendEmailRequest = { userEmail: userEmail };
    return this._http.post<EmailVerificationResponse>(`${this.url}/SendEmailVerification`, model, httpOptions);
  }

  activateAccount(activateAccountRequest: ActivateAccountRequest): Observable<ActivateAccountRequest>{
    return this._http.patch<ActivateAccountRequest>(`${this.url}/VerifyAccount`, activateAccountRequest, httpOptions);
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
      })
    );
  }

  signOut(){
    Storage.remove({key: 'user'});
    this.userSubject.next(null);
    this._router.navigate(['/login']);
  }
}
