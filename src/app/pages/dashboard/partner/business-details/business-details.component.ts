import { ModalController } from '@ionic/angular';
import { FormGroup} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BusinessResponse } from 'src/app/core/commons/models/responses/BusinessResponse';
import { VerificateAuthService } from 'src/app/services/verificate-auth.service';
import { SellCreditComponent } from '../sell-credit/sell-credit.component';


@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.scss'],
})
export class BusinessDetailsComponent implements OnInit {

  
  hasAuthorizationSubscrition: Subscription;
  sellCreditSubscription:Subscription;
  authorizationInterval;
  business: BusinessResponse;
  form:FormGroup;
  constructor(private _verificateAuthService: VerificateAuthService, 
              private _router: Router,
              private _modalCtrl:ModalController) { 
    const navExtras = this._router.getCurrentNavigation();
    this.business = navExtras.extras.state?.value; 
  }

  ngOnInit() {
    this.authorizationInterval = setInterval( async ()=>{
      this.hasAuthorizationSubscrition = (await this._verificateAuthService.getAuthorizationForBusiness()).subscribe(result=>{

      }, error=>{ clearInterval(this.authorizationInterval); });
    }, 3000);
  }





  async SellCreditFormModal(){

    const modal= await this._modalCtrl.create({
      component:SellCreditComponent,
      cssClass:'sell-credit',
      componentProps:{
        businessAccountNumber:this.business.businessNumber
      }
    })
    return await modal.present();
  }





}
