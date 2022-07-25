import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpListPage } from './emp-list.page';

const routes: Routes = [
  {
    path: '',
    component: EmpListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpListPageRoutingModule {}
