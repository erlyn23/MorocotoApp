import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

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
}
