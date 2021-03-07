import { BusinessService } from 'src/app/services/business.service';
import { BusinessResponse } from '../models/responses/BusinessResponse';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit{

  @Input("businessList") businessList: BusinessResponse[] = []; 
  constructor() { }
  
  ngOnInit(): void {
  }
}
