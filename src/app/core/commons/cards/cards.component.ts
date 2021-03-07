import { BusinessService } from 'src/app/services/business.service';
import { BusinessResponse } from '../models/responses/BusinessResponse';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit{

  @Input("businessList") businessList: BusinessResponse[] = []; 

  navigatorExtras: NavigationExtras = { state: { value: null } };
  constructor(private _router: Router) { 
  }
  
  ngOnInit(): void {
  }

  goToBusinessDetails(business: BusinessResponse): void{
    this.navigatorExtras.state.value = business;

    this._router.navigate(['/business-details'], this.navigatorExtras);
  }
}
