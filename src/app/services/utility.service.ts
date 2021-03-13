import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import jwt_decode  from 'jwt-decode';
import { UserDecodedResponse } from '../core/commons/models/responses/user-decoded-response.interface';
import { UserResponse } from '../core/commons/models/responses/user-response';
import { HttpHeaders } from '@angular/common/http';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private _alertCtrl: AlertController, 
    private _toastCtrl: ToastController,
    private _lodingCtrl: LoadingController) { }

  async presentInfoAlert(header: string, message: string, callBack?: any)
  {
    const alertInfo = this._alertCtrl.create({
      header: header,
      message: message,
      cssClass: 'info-alert',
      buttons: [
        { text: 'Aceptar',
          handler: callBack
        }
      ],
      backdropDismiss: false
    });
    (await alertInfo).present();
  }

  async presentErrorToast(message: string)
  {
    const errorToast = this._toastCtrl.create({
      message: message,
      duration: 3000,
      cssClass: 'error-message'
    });
    (await errorToast).present();
  }
async succesfull(){
  const succesfullCheckmark= this._lodingCtrl.create({
    cssClass:'success-checkmark',
    message:'La transaccion se completo exitosamente.'
  });
  (await succesfullCheckmark).present();
}

  async presentLoading()
  {
    const loadingSpinner = this._lodingCtrl.create({
      cssClass: 'my-loading',
      message: 'Procesando solicitud, por favor espere...'
    });
    (await loadingSpinner).present();
  }
  

  closeLoading(){
    this._lodingCtrl.dismiss();
  }

  httpOptions: HttpHeaders;
  async setHttpOptions(): Promise<HttpHeaders>{
    const savedUser = (await Storage.get({key: 'user'})).value;
    const userObject: UserResponse = JSON.parse(savedUser);
    const token = userObject.token;  
    return this.httpOptions = new HttpHeaders(
      {"content-type": "application/json",
      "Authorization": `Bearer ${token}`
      });
  }
  
  async getDecodedUser(): Promise<UserDecodedResponse>{
    const savedUser = await Storage.get({key: 'user'});
    const userObject: UserResponse = JSON.parse(savedUser.value); 
    const userDecoded: UserDecodedResponse = jwt_decode(userObject.token);
    return userDecoded;
  }
}
