import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graphic1Component } from './graphic1/graphic1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './maintenance/users/users.component';
import { HospitalsComponent } from './maintenance/hospitals/hospitals.component';
import { DoctorsComponent } from './maintenance/doctors/doctors.component';
import { DoctorComponent } from './maintenance/doctors/doctor.component';
import { SearchComponent } from './search/search.component';
import { adminGuard } from '../guards/admin.guard';
import { RouterModule, Routes } from '@angular/router';

const childRoutes: Routes = [
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
  {
    path: 'search/:term',
    component: SearchComponent,
    data: { title: 'Searches' },
  },
  //Maintenance

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
  {
    path: 'doctor/:id',
    component: DoctorComponent,
    data: { title: 'Application doctors' },
  },
  //Admin routes
  {
    path: 'users',
    canActivate: [adminGuard],
    component: UsersComponent,
    data: { title: 'Application user' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
