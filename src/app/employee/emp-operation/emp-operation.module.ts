import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpOperationPageRoutingModule } from './emp-operation-routing.module';

import { EmpOperationPage } from './emp-operation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EmpOperationPageRoutingModule
  ],
  declarations: [EmpOperationPage]
})
export class EmpOperationPageModule { }
