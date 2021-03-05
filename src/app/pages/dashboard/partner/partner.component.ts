import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BusinessResponse } from 'src/app/core/commons/models/responses/BusinessResponse';
import { BusinessService } from 'src/app/services/business.service';
import { CreateBusinessComponent } from './create-business/create-business.component';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss'],
})
export class PartnerComponent implements OnInit {
  businesses:BusinessResponse[];
  constructor(private _modalCtrl: ModalController,private _business:BusinessService,
    private _router:Router) { }

  ngOnInit() {
    this.BusinessList();
  }

  async openCreateBusiness(): Promise<void>{
    const createBusinessModal = this._modalCtrl.create({ component: CreateBusinessComponent });
    (await createBusinessModal).present();
  }

  async BusinessList(){
    (await this._business.GetAllBusiness()).subscribe((data:any)=>{
      this.businesses=data;
      console.log(this.businesses);
  
    }, error=>{
      console.log("Error",error
      )
    });
  }
}
