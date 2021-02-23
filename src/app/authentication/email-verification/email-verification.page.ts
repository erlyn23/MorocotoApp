import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.page.html',
  styleUrls: ['./email-verification.page.scss'],
})
export class EmailVerificationPage implements OnInit {

  userEmail: string;
  constructor(private _accountService: AccountService, private _router: Router) {
    const navigationExtras = this._router.getCurrentNavigation();
    this.userEmail = navigationExtras.extras?.state?.value;
  }

  ngOnInit() {
    if(this.userEmail !== undefined)
    {
      this._accountService.sendVerificationEmail(this.userEmail).subscribe(result=>{
        if(result)
        {
          //TODO: Informar al usuario
        }
      }, error => { console.error(error);
       });
    }
  }

}
