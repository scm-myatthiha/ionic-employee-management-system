import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'emp-list',
    pathMatch: 'full'
  },
  {
    path: 'emp-list',
    loadChildren: () => import('./employee/emp-list/emp-list.module').then(m => m.EmpListPageModule)
  },
  {
    path: 'emp-operation',
    loadChildren: () => import('./employee/emp-operation/emp-operation.module').then(m => m.EmpOperationPageModule)
  },
  {
    path: 'pagination',
    loadChildren: () => import('./components/pagination/pagination.module').then( m => m.PaginationPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
