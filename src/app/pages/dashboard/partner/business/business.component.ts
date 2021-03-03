import { BusinessRequest } from '../../../../core/commons/models/requests/business-request.interface';
import { BusinessService } from './../../../../services/business.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
})
export class BusinessComponent implements OnInit {

  accounNumber:string;
  businesses:BusinessRequest[];
  constructor(private _business:BusinessService,
              private _router:Router) { }

  ngOnInit() {

    //this.businesses=this._business.GetAllBusiness(this.accounNumber);
    
  }

}
