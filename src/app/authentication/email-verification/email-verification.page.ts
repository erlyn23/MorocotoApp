import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { ActivateAccountRequest } from 'src/app/core/commons/models/requests/activate-account-request.interface';
import { UserRequest } from 'src/app/core/commons/models/requests/user-request.interface';
import { EmailVerificationResponse } from 'src/app/core/commons/models/responses/email-verification-response.interface';
import { AccountService } from 'src/app/services/account.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.page.html',
  styleUrls: ['./email-verification.page.scss'],
})
export class EmailVerificationPage implements OnInit {

  newUser: UserRequest;
  verificationCode: string;

  sendVerificationEmailSubscription: Subscription;
  activateAccountSubscription: Subscription;
  constructor(private _accountService: AccountService, 
    private _router: Router, 
    private _utilityService: UtilityService) {
    const navigationExtras = this._router.getCurrentNavigation();
    this.newUser = navigationExtras.extras?.state?.value;
  }

  ngOnInit() {
    if(this.newUser !== undefined)
    {
        this.sendEmailVerification();
    }
  }

  sendEmailVerification(): void{
    this.sendVerificationEmailSubscription = this._accountService.sendVerificationEmail(this.newUser.email).subscribe(result=>{
      if(result)
      {
        const message = 'Hemos enviado un código a tu correo electrónico, por favor verifica y activa tu cuenta';
        this._utilityService.presentInfoAlert('Información', message);
      }
    }, error => { console.error(error);
     });
  }

  async activateAccount(): Promise<void>{
    const activateAccountRequest: ActivateAccountRequest =
    { identificationDocument: this.newUser.identificationDocument, verificationNumber: this.verificationCode.toString() }
    await this._utilityService.presentLoading();
    this.activateAccountSubscription = this._accountService.activateAccount(activateAccountRequest).subscribe(result=>{
      if(result){
        this._utilityService.closeLoading();
        const message = 'Tu cuenta se ha activado correctamente, inicia sesión para continuar';
        this._utilityService.presentInfoAlert('Información', message);
        this._router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    this.sendVerificationEmailSubscription.unsubscribe();
    this.activateAccountSubscription.unsubscribe();
  }
}
