import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { UtilityService } from 'src/app/services/utility.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  userType: string;
  constructor(private _accountService: AccountService, 
    private _utilityService: UtilityService) { }

  async ngOnInit() {
    this.userType = (await this._utilityService.getUserDecoded()).UserType;
  }
}
