import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _router: Router, private _accountService: AccountService){}

  canActivate(
    next: ActivatedRouteSnapshot) {
      const user = this._accountService.getUserData;

      if(user){
        return true;
      }
      this._router.navigate(['/login']);
      return false;
  }
  
}
