import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpListPageRoutingModule } from './emp-list-routing.module';

import { EmpListPage } from './emp-list.page';
import { PaginationPage } from '../../components/pagination/pagination.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EmpListPageRoutingModule
  ],
  declarations: [EmpListPage, PaginationPage],
})
export class EmpListPageModule { }
