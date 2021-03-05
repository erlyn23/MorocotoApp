import { BusinessResponse } from './../../core/commons/models/responses/BusinessResponse';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent {

  @Input() businessList:BusinessResponse[];
  
  constructor() { }

  

}
