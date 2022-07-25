import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpOperationPage } from './emp-operation.page';

const routes: Routes = [
  {
    path: '',
    component: EmpOperationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpOperationPageRoutingModule {}
