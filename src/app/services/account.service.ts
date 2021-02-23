import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRequest } from '../core/commons/models/requests/user-request.interface';
import { Observable } from 'rxjs';
import { EmailVerificationResponse } from '../core/commons/models/responses/email-verification-response.interface';
import { ActivateAccountRequest } from '../core/commons/models/requests/activate-account-request.interface';


const httpOptions = {headers: new HttpHeaders({"content-type": "application/json"})}; 

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private url: string = environment.endpoints.account;
  constructor(private _http: HttpClient) { }

  registerUser(userRequest: UserRequest): Observable<number>{
    return this._http.post<number>(`${this.url}`, userRequest, httpOptions);
  }

  sendVerificationEmail(userEmail: string): Observable<EmailVerificationResponse>{
    return this._http.post<EmailVerificationResponse>(`${this.url}/api/Account/SendEmailVerification`, userEmail, httpOptions);
  }

  activateAccount(activateAccountRequest: ActivateAccountRequest): Observable<ActivateAccountRequest>{
    return this._http.put<ActivateAccountRequest>(`${this.url}/VerifyAccount`, activateAccountRequest, httpOptions);
  }
}
