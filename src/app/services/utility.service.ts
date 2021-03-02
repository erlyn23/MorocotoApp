import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import jwt_decode  from 'jwt-decode';
import { UserDecodedResponse } from '../core/commons/models/responses/user-decoded-response.interface';
import { UserResponse } from '../core/commons/models/responses/user-response';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private _alertCtrl: AlertController, 
    private _toastCtrl: ToastController,
    private _lodingCtrl: LoadingController) { }

  async presentInfoAlert(header: string, message: string)
  {
    const alertInfo = this._alertCtrl.create({
      header: header,
      message: message,
      cssClass: 'info-alert',
      buttons: [
        { text: 'Aceptar' }
      ]
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

  async getUserDecoded(): Promise<UserDecodedResponse>{
    const userString: string = (await Storage.get({key: 'user'})).value;
    const userObject: UserResponse = JSON.parse(userString);
    const userDecoded: UserDecodedResponse = jwt_decode(userObject.token);
    return userDecoded;
  }
}
