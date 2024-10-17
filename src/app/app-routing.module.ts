import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from './guards/auth.guard';
// import { PublicGuard } from './guards/public.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome', // TODO: Set this to ''
    pathMatch: 'full'
  },
  {
    path: '',
     //loadChildren: () => import('./pages/main/dashboard/dashboard.module').then(m => m.DashboardPageModule),
    loadChildren: () => import('./pages/main/main.module').then(m => m.MainModule),
    // canActivate: [AuthGuard] // Secure all child pages
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/main/dashboard/dashboard.module').then(m => m.DashboardPageModule),
  },
  {
    path: 'allorders',
    loadChildren: () => import('./pages/main/all-orders/all-orders.module').then( m => m.AllOrdersPageModule)
  },
  {
    path: 'show-order-details',
    loadChildren: () => import('./pages/main/show-order-details/show-order-details.module').then( m => m.ShowOrderDetailsPageModule)
  },
  /* {
    path: 'barscan',
    loadChildren: () => import('./pages/main/barscan/barscan.module').then( m => m.BarscanPageModule)
  }, */




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
