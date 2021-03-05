import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardsComponent } from './cards/cards.component';
import { HeaderComponent } from '../core/commons/header/header.component';



@NgModule({
  declarations: [HeaderComponent, CardsComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule
  ],
  exports: [HeaderComponent,CardsComponent]
},
)
export class SharedModule { }
