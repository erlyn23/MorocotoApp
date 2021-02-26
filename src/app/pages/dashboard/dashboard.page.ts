import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(private _accountService: AccountService) { }

  ngOnInit() {
    this._accountService.signOut();
  }

}
