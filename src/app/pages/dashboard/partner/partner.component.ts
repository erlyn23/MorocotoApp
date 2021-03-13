import { BusinessResponse } from './../../../core/commons/models/responses/BusinessResponse';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BusinessService } from 'src/app/services/business.service';
import { CreateBusinessComponent } from './create-business/create-business.component';
import { UtilityService } from 'src/app/services/utility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss'],
})
export class PartnerComponent implements OnInit {
  
  businesses:BusinessResponse[];

  getAllBusinessesSubscrition: Subscription;
  constructor(private _modalCtrl: ModalController,
    private _business:BusinessService,
    private _utilityService: UtilityService,
    private _router:Router) { }

  async ngOnInit() {
    await this.BusinessList(false);
  }
  
  async openCreateBusiness(): Promise<void>{
    const createBusinessModal = this._modalCtrl.create({ component: CreateBusinessComponent });
    (await createBusinessModal).present();
  }
  
  async BusinessList(wantToReset: boolean){
    this.getAllBusinessesSubscrition = (await this._business.GetAllBusiness()).subscribe((data:BusinessResponse[])=>{
      this.businesses = [];
      if(wantToReset){
        this.businesses = [];
        this.businesses = data;
      }else{
        this.businesses = data;
      }
    }, error=>{
      console.log("Error",error);
    });
  }
  
  ngOnDestroy(): void {
    if(this.getAllBusinessesSubscrition !== undefined){
      this.getAllBusinessesSubscrition.unsubscribe();
    }
  }
}
