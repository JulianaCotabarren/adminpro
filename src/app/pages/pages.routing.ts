import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graphic1Component } from './graphic1/graphic1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AuthGuard } from '../guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './maintenance/users/users.component';
import { HospitalsComponent } from './maintenance/hospitals/hospitals.component';
import { DoctorsComponent } from './maintenance/doctors/doctors.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
      {
        path: 'progress',
        component: ProgressComponent,
        data: { title: 'Progress' },
      },
      {
        path: 'graphic1',
        component: Graphic1Component,
        data: { title: 'Graphics' },
      },
      {
        path: 'settings',
        component: AccountSettingsComponent,
        data: { title: 'Settings' },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'User profile' },
      },
      //Maintenance
      {
        path: 'users',
        component: UsersComponent,
        data: { title: 'Application user' },
      },
      {
        path: 'hospitals',
        component: HospitalsComponent,
        data: { title: 'Application hospitals' },
      },
      {
        path: 'doctors',
        component: DoctorsComponent,
        data: { title: 'Application doctors' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
