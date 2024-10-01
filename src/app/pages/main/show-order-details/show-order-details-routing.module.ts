import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowOrderDetailsPage } from './show-order-details.page';

const routes: Routes = [
  {
    path: '',
    component: ShowOrderDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowOrderDetailsPageRoutingModule {}
