import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { environment } from 'src/environments/environment';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  private url: string = environment.endpoints.business;
  httpOptions: any;
  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  async setHttpOptions(): Promise<any>{
    await Storage.get({key: 'user'}).then(object =>{
      this.httpOptions = {headers: new HttpHeaders(
        {"content-type": "application/json",
        "Authorization": `Bearer ${JSON.parse(object.value).token}`
        })};
    });
  }
}
