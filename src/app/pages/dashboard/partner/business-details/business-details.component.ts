import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BusinessResponse } from 'src/app/core/commons/models/responses/BusinessResponse';
import { VerificateAuthService } from 'src/app/services/verificate-auth.service';

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.scss'],
})
export class BusinessDetailsComponent implements OnInit {

  hasAuthorizationSubscrition: Subscription;
  authorizationInterval;

  business: BusinessResponse;
  constructor(private _verificateAuthService: VerificateAuthService, 
  private _router: Router) { 
    const navExtras = this._router.getCurrentNavigation();
    this.business = navExtras.extras.state?.value; 
  }

  ngOnInit() {
    this.authorizationInterval = setInterval( async ()=>{
      this.hasAuthorizationSubscrition = (await this._verificateAuthService.getAuthorizationForBusiness()).subscribe(result=>{

      }, error=>{ clearInterval(this.authorizationInterval); });
    }, 3000);
  }

}
