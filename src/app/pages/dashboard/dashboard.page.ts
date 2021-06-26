import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { BusinessService } from 'src/app/services/business.service';
import { UtilityService } from 'src/app/services/utility.service';
import { VerificateAuthService } from 'src/app/services/verificate-auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  userType: string;

  hasAuthorizationSubscrition: Subscription;
  authorizationInterval;
  constructor(private _verificateAuthService: VerificateAuthService, 
    private _utilityService: UtilityService) { }

  async ngOnInit() {
    this.authorizationInterval = setInterval( async ()=>{
      this.hasAuthorizationSubscrition = (await this._verificateAuthService.getAuthorizationForBusiness()).subscribe(result=>{
        
      }, error=>{ clearInterval(this.authorizationInterval); });
    }, 3000);
    this.userType = (await this._utilityService.getDecodedUser()).UserType;
  }

  ngOnDestroy(): void {
    clearInterval(this.authorizationInterval);
    if(this.hasAuthorizationSubscrition !== undefined){
      this.hasAuthorizationSubscrition.unsubscribe();
    }
  }
}
