import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';
import { UserRequest } from 'src/app/core/commons/models/requests/user-request.interface';
import { UserAddressRequest } from 'src/app/core/commons/models/requests/user-address-request.interface';
import { UserPhoneNumbers } from 'src/app/core/commons/models/requests/user-phoneNumbers-request.interface';
import { AccountService } from 'src/app/services/account.service';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';

const { Device } = Plugins; 

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  segment: string = "accountInfo";
  basicInfoForm: FormGroup;
  lockInfoForm: FormGroup;
  locationInfoForm: FormGroup;
  contactInfoForm: FormGroup;
  private emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private justNumbersPattern: string = "[0-9]*";
  private navigationExtras: NavigationExtras = {state: {userEmail: null}};

  registerUserSubscription: Subscription;
  constructor(private _formBuilder: FormBuilder,
    private _accountService: AccountService,
    private _router: Router, 
    private _utilityService: UtilityService) { }

  ngOnInit() {
    this.initForms();
  }

  private initForms(): void{
    this.basicInfoForm = this._formBuilder.group({
      fullName: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      identificationDocument: ["",[Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(this.justNumbersPattern)]],
      email: ["",[Validators.required, Validators.maxLength(50), Validators.pattern(this.emailPattern)]],
      userTypeId: ["", [Validators.required]],
      birthDate: ["", [Validators.required]],
      password: ["",[Validators.required, Validators.minLength(4), Validators.maxLength(8), Validators.pattern(this.justNumbersPattern)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(8), Validators.pattern(this.justNumbersPattern)]]
    });
    
    this.lockInfoForm = this._formBuilder.group({
      securityQuestionId: ["",[Validators.required]],
      securityAnswer: ["",[Validators.required]],
      pin: ["",[Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(this.justNumbersPattern)]]
    });

    this.locationInfoForm = this._formBuilder.group({
      country: ["", [Validators.required]],
      province: ["",[Validators.required]],
      city: ["",[Validators.required]],
      street1: ["", [Validators.required]],
      street2: ["", [Validators.required]]
    });

    this.contactInfoForm = this._formBuilder.group({
      phoneNumber: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(this.justNumbersPattern)]]
    })
  }

  isValidField(field: string, form: FormGroup): string{
    const validField = form.get(field);
    return (validField.invalid && validField.touched) ? 'is-invalid' : validField.touched ? 'is-valid': '';
  }

  segmentChange(ev: CustomEvent): void{
    this.segment = ev.detail.value
  }

  setNextStep(step: string): void
  {
    switch(step)
    {
      case "basic":
        this.segment = "accountInfo";
        break;
      case "lock":
        this.segment = "securityInfo";
        break;
      case "location":
        this.segment = "locationInfo";
        break;
      case "contact":
        this.segment = "contactInfo";
        break;
    }
  }

  async registerUser(): Promise<void>
  {
    this._utilityService.presentLoading();
    if(this.basicInfoForm.valid && this.lockInfoForm.valid && this.locationInfoForm.valid && this.contactInfoForm.valid)
    {
      if(this.verifyPasswords(this.basicInfoForm.value.confirmPassword))
      {
        const userAddressesRequest: UserAddressRequest = 
        {
          id: 0,
          country: this.locationInfoForm.value.country,
          city: this.locationInfoForm.value.city,
          province: this.locationInfoForm.value.province,
          street1: this.locationInfoForm.value.street1,
          street2: this.locationInfoForm.value.street2,
          userId: 0
        };
        const userPhoneNumbersRequest: UserPhoneNumbers = 
        {
          id: 0,
          phoneNumber: this.contactInfoForm.value.phoneNumber,
          userId: 0
        }
        const userRequest: UserRequest = 
        {
          id: 0,
          accountNumber: Date.now().toString(),
          userPhone: (await Device.getInfo()).model,
          osPhone: `${(await Device.getInfo()).osVersion}`,
          fullName: this.basicInfoForm.value.fullName,
          identificationDocument: this.basicInfoForm.value.identificationDocument,
          email: this.basicInfoForm.value.email,
          birthDate: this.basicInfoForm.value.birthDate,
          userPassword: this.basicInfoForm.value.password,
          pin: this.lockInfoForm.value.pin,
          securityQuestionId: this.lockInfoForm.value.securityQuestionId,
          securityAnswer: this.lockInfoForm.value.securityAnswer,
          userTypeId: this.basicInfoForm.value.userTypeId,
          userAddresses: [userAddressesRequest],
          userPhoneNumbers: [userPhoneNumbersRequest]
        };
        this.registerUserSubscription = this._accountService.registerUser(userRequest).subscribe(result=>{
          if(result) 
          {
            this._utilityService.closeLoading();
            this.navigationExtras.state.value = userRequest;
            this._router.navigate(['/email-verification'], this.navigationExtras);
          }
        }, error=> { console.log(error); this._utilityService.closeLoading(); });
      }
      else
      {
        await this._utilityService.presentErrorToast('Las contraseñas no coinciden');
        this._utilityService.closeLoading();
      }
    }
  }

  verifyPasswords(password: string): boolean{
    if(password !== this.basicInfoForm.value.password)
    {
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    if(this.registerUserSubscription !== undefined){
      this.registerUserSubscription.unsubscribe();
    }
  }
}
