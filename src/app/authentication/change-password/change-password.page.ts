import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChangePasswordRequest } from 'src/app/core/commons/models/requests/change-password-request.interface';
import { AccountService } from 'src/app/services/account.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  changePasswordForm: FormGroup;

  changePasswordSubscription: Subscription;
  constructor(private _formBuilder: FormBuilder, 
    private _accountService: AccountService, 
    private _utilityService: UtilityService,
    private _router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm():void{
    this.changePasswordForm = this._formBuilder.group({
      identificationDocument: ["", [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("[0-9]*")]],
      securityQuestionId: ["", [Validators.required]],
      securityAnswer: ["", [Validators.required]],
      password: ["",[Validators.required, Validators.minLength(4), Validators.maxLength(8), Validators.pattern("[0-9]*")]],
      confirmPassword: ["",[Validators.required, Validators.minLength(4), Validators.maxLength(8), Validators.pattern("[0-9]*")]]
    });
  }

  isValidField(field: string): string{
    const validField = this.changePasswordForm.get(field);

    return (!validField.valid && validField.touched) ? 'is-invalid': validField.touched ? 'is-valid': '';
  }

  async changePassword(): Promise<void>{
    await this._utilityService.presentLoading();
    if(this.changePasswordForm.value.password === this.changePasswordForm.value.confirmPassword)
    {
      const changePasswordRequest: ChangePasswordRequest = {
        identificationDocument: this.changePasswordForm.value.identificationDocument,
        securityQuestionId: this.changePasswordForm.value.securityQuestionId,
        securityQuestionAnswer: this.changePasswordForm.value.securityAnswer,
        password1: this.changePasswordForm.value.password,
        password2: this.changePasswordForm.value.confirmPassword
      };

      this.changePasswordSubscription = this._accountService.changePassword(changePasswordRequest).subscribe(result=>{
        if(result){
          this._utilityService.presentInfoAlert('Contraseña cambiada', 'Tu contraseña ha sido cambiada correctamente, intenta iniciar sesión para continuar');
          this._utilityService.closeLoading();
          this._router.navigate(['/login']);
        }
      }, error =>{ console.error(error), this._utilityService.closeLoading() });
    }
    else
    {
      this._utilityService.presentErrorToast('Las contraseñas no coinciden');
      this._utilityService.closeLoading();
    }
  }

  goToLogin(): void{
    this._router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if(this.changePasswordSubscription !== undefined){
      this.changePasswordSubscription.unsubscribe();
    }
  }

}
