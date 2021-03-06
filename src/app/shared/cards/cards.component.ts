import { BusinessService } from 'src/app/services/business.service';
import { BusinessResponse } from './../../core/commons/models/responses/BusinessResponse';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit{

  
  list:BusinessResponse[];
  constructor(private _businessService:BusinessService) {
    
   }

  ngOnInit()
  {
    this.list=this._businessService.getBusinesses();
    
  }

  

}
