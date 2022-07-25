import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginationPage } from './pagination.page';

const routes: Routes = [
  {
    path: '',
    component: PaginationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaginationPageRoutingModule {}
