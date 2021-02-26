import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Plugins } from '@capacitor/core';
import { UserRequest } from 'src/app/core/commons/models/requests/user-request.interface';
import { AuthRequest } from 'src/app/core/commons/models/requests/auth-request';

const { Storage, Device } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  constructor(private _formBuilder: FormBuilder, 
    private _accountService: AccountService,
    private _router: Router,
    private _utilityService: UtilityService) { }

  ngOnInit() {
    this.initForm();
    this.verificateLogin().then(value=>{
      if(value){
        this._router.navigate(['/dashboard']);
      }
    });
  }

  async verificateLogin(): Promise<string>{
    return (await Storage.get({key: 'user'})).value
  }

  private initForm(): void{
    this.loginForm = this._formBuilder.group({
      identificationDocument: ["", [Validators.required]],
      userPassword: ["", [Validators.required]]
    });
  }

  async signIn(): Promise<void>{
    const user: AuthRequest = {
      identificationDocument: this.loginForm.value.identificationDocument.toString(),
      userPassword: this.loginForm.value.userPassword,
      userPhone: (await Device.getInfo()).model,
      osPhone: (await Device.getInfo()).osVersion
    }
    await this._utilityService.presentLoading();
    this._accountService.signIn(user).subscribe(result=>{
      if(result){
        this._utilityService.closeLoading();
        this._router.navigate(['/dashboard']);
        this.loginForm.reset();
      }
    }, error=>{ this._utilityService.closeLoading(); });
  }
}
