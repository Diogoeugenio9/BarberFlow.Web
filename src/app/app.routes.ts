import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { Services } from './pages/services/services';
import { Appointments } from './pages/appointments/appointments';
import { MyAppointments } from './pages/my-appointments/my-appointments';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminAppointments } from './pages/admin-appointments/admin-appointments';
import { AdminBarbers } from './pages/admin-barbers/admin-barbers';
import { AdminBarberForm } from './pages/admin-barber-form/admin-barber-form';
import { AdminServices } from './pages/admin-services/admin-services';
import { AdminServiceForm } from './pages/admin-service-form/admin-service-form';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'services',
    component: Services
  },
  {
  path: 'appointments',
  component: MyAppointments
},
{
  path: 'appointments/new',
  component: Appointments
},
{ path: 'admin',
   component: AdminDashboard
},
{
  path: 'admin/appointments',
  component: AdminAppointments
},
{
  path: 'admin/barbers',
  component: AdminBarbers
},
{
  path: 'admin/barbers/new',
  component: AdminBarberForm
},
{
  path: 'admin/barbers/edit/:id',
  component: AdminBarberForm
},
{
  path: 'admin/services',
  component: AdminServices
},
{ path: 'admin/services/new',
   component: AdminServiceForm
},
{ path: 'admin/services/edit/:id',
   component: AdminServiceForm
},


];
