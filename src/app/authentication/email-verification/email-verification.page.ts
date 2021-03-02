import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ActivateAccountRequest } from 'src/app/core/commons/models/requests/activate-account-request.interface';
import { SendEmailRequest } from 'src/app/core/commons/models/requests/send-email-request.interface';
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
  sendEmailVerificationForm: FormGroup;

  sendVerificationEmailSubscription: Subscription;
  activateAccountSubscription: Subscription;
  constructor(private _accountService: AccountService, 
    private _router: Router, 
    private _utilityService: UtilityService,
    private _formBuilder: FormBuilder) {
    const navigationExtras = this._router.getCurrentNavigation();
    this.newUser = navigationExtras.extras?.state?.value;
  }

  ngOnInit() {
    this.initForm();
    if(this.newUser !== undefined)
    {
        this.sendEmailVerification();
    }
  }

  private initForm(): void{
    this.sendEmailVerificationForm = this._formBuilder.group({
      identificationDocument: ["", [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("[0-9]*")]],
      verificationCode: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("[0-9]*")]]
    });
  }

  isValidField(field: string){
    const validField = this.sendEmailVerificationForm.get(field);

    return (!validField.valid && validField.touched) ? 'is-invalid' : validField.touched ? 'is-valid': '';
  }

  async sendEmailVerification(): Promise<void>{
    if(this.sendEmailVerificationForm.get('identificationDocument').valid || this.newUser !== undefined)
    {
      await this._utilityService.presentLoading();
      let sendEmailRequest: SendEmailRequest;
      if(this.newUser === undefined)
        sendEmailRequest = { userEmail: '', identificationDocument: this.sendEmailVerificationForm.value.identificationDocument, verificationType: 'Activate' }
      else
        sendEmailRequest = { userEmail: this.newUser.email, identificationDocument: '', verificationType: 'Register' };

      this.sendVerificationEmailSubscription = this._accountService.sendVerificationEmail(sendEmailRequest).subscribe(result=>{
        if(result)
        {
          this._utilityService.closeLoading();
          const message = 'Hemos enviado un código a tu correo electrónico, por favor verifica y activa tu cuenta';
          this._utilityService.presentInfoAlert('Información', message);
        }
      }, error => { this._utilityService.closeLoading(); console.error(error); });
    }
    else
    {
      this._utilityService.presentErrorToast('Debes escribir tu cédula');
    }
  }

  async activateAccount(): Promise<void>{
    if(this.sendEmailVerificationForm.get('verificationCode').valid)
    {
      let activateAccountRequest: ActivateAccountRequest;
      if(this.newUser === undefined)
        activateAccountRequest = { identificationDocument: this.sendEmailVerificationForm.value.identificationDocument, verificationNumber: this.sendEmailVerificationForm.value.verificationCode };
      else
        activateAccountRequest = { identificationDocument: this.newUser.identificationDocument, verificationNumber: this.sendEmailVerificationForm.value.verificationCode }
      
      await this._utilityService.presentLoading();
      this.activateAccountSubscription = this._accountService.activateAccount(activateAccountRequest).subscribe(result=>{
        if(result){
          this._utilityService.closeLoading();
          const message = 'Tu cuenta se ha activado correctamente, inicia sesión para continuar';
          this._utilityService.presentInfoAlert('Información', message);
          this._router.navigate(['/login']);
        }
      }, error => { this._utilityService.closeLoading(); });
    }
  }

  goToLogin(): void{
    this._router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if(this.activateAccountSubscription !== undefined && this.sendVerificationEmailSubscription !== undefined){
      this.sendVerificationEmailSubscription.unsubscribe();
      this.activateAccountSubscription.unsubscribe();
    }
  }
}
