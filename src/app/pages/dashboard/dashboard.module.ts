import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';

import { SharedModule } from 'src/app/Shared/shared.module';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';


import { CustomerComponent } from './customer/customer.component';
import { PartnerComponent } from './partner/partner.component';
import { CreateBusinessComponent } from './partner/create-business/create-business.component';
import { BusinessDetailsComponent } from './partner/business-details/business-details.component';
import { SellCreditComponent } from './partner/sell-credit/sell-credit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    SharedModule,
    
  ],
  declarations: [DashboardPage,SellCreditComponent,PartnerComponent,CustomerComponent, CreateBusinessComponent, BusinessDetailsComponent]
})
export class DashboardPageModule {}
