import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreateBusinessComponent } from './create-business/create-business.component';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss'],
})
export class PartnerComponent implements OnInit {

  constructor(private _modalCtrl: ModalController) { }

  ngOnInit() {}

  async openCreateBusiness(): Promise<void>{
    const createBusinessModal = this._modalCtrl.create({ component: CreateBusinessComponent });
    (await createBusinessModal).present();
  }
}
