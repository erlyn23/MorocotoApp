import { CustomerComponent } from './customer/customer.component';
import { PartnerComponent } from './partner/partner.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { SharedModule } from 'src/app/Shared/shared.module';
import { CreateBusinessComponent } from './partner/create-business/create-business.component';
import { BusinessDetailsComponent } from './partner/business-details/business-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    SharedModule
  ],
  declarations: [DashboardPage,PartnerComponent,CustomerComponent, CreateBusinessComponent, BusinessDetailsComponent]
})
export class DashboardPageModule {}
