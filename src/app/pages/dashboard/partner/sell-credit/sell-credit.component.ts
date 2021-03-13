import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SellCreditRequest } from 'src/app/core/commons/models/requests/sellCredit-request';
import { BusinessResponse } from 'src/app/core/commons/models/responses/BusinessResponse';
import { BusinessService } from 'src/app/services/business.service';
import { UtilityService } from 'src/app/services/utility.service';
import { VerificateAuthService } from 'src/app/services/verificate-auth.service';

@Component({
  selector: 'app-sell-credit',
  templateUrl: './sell-credit.component.html',
  styleUrls: ['./sell-credit.component.scss'],
})
export class SellCreditComponent implements OnInit {

  private justNumbersPattern: string = "[0-9]*";
  hasAuthorizationSubscrition: Subscription;
  sellCreditSubscription:Subscription;
  authorizationInterval;
  business: BusinessResponse;
  sellCreditForm:FormGroup;
  @Input() businessAccountNumber:string;

  constructor(private _verificateAuthService: VerificateAuthService, 
    private _router: Router,
    private _businessService:BusinessService,
    private _utility:UtilityService,
    private _builder:FormBuilder,
    private _modalCtrl:ModalController) { }

  ngOnInit() {
    this.isAuthorized();

    this.initForms();
  }
  private initForms():void{
    this.sellCreditForm= this._builder.group({

      customerAccountNumber:["",[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.justNumbersPattern)]],
      creditSelled: ["",[Validators.required, Validators.pattern(this.justNumbersPattern)]],
      pin:["",[Validators.required,Validators.minLength(4),Validators.maxLength(4),Validators.pattern(this.justNumbersPattern)]] 
      
    });
  }

  isAuthorized(){
    this.authorizationInterval = setInterval( async ()=>{
      this.hasAuthorizationSubscrition = (await this._verificateAuthService.getAuthorizationForBusiness()).subscribe(result=>{

      }, error=>{ clearInterval(this.authorizationInterval); });
    }, 3000);
  }
  async sellCredit(){
    await this._utility.presentLoading();

    const sellCredit:SellCreditRequest={

      BusinessAccountNumber:this.businessAccountNumber,
      CustomerAccountNumber:this.sellCreditForm.value.customerAccountNumber,
      CreditSelled:this.sellCreditForm.value.creditSelled,
      Pin:this.sellCreditForm.value.pin
    }

    this.sellCreditSubscription = 
      (await this._businessService.sellCredit(sellCredit))
         .subscribe(result=>{
          if(result){
            this._utility.closeLoading();
            this._utility.succesfull();
            this.closeModal();
          }
       } ,error=>{
        console.log(error); this._utility.closeLoading();  
        this.closeModal();
      });

      
    
  }
  isValidField(field: string, form: FormGroup): string{
    const validField = form.get(field);
    return (validField.invalid && validField.touched) ? 'is-invalid' : validField.touched ? 'is-valid': '';
  }
  
  closeModal(){
    if (this._modalCtrl) {
      this._modalCtrl.dismiss().then(() => { this._modalCtrl = null; });
    
    }      
  }
  ngOnDestroy(): void {
    if(this.sellCreditSubscription !== undefined){
      this.sellCreditSubscription.unsubscribe();
    }
  }
}
