import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthLogoutComponent } from './auth/auth-logout/auth-logout.component';
import { HelpComponent } from './shared/help/help.component';
import { AuthGuestComponent } from './auth/auth-guest/auth-guest.component';
import { AnalysisComponent } from './analysis/analysis.component';


const routes: Routes = [
  {path: '', redirectTo: 'auth', pathMatch: 'full'},
  {path: 'auth', component: AuthComponent},
  {path: 'logout', component: AuthLogoutComponent},
  {path: 'help', component: HelpComponent},
  {path: 'analysis/:adminId/:testId', component: AnalysisComponent},
  {path: 'guest/:adminId/:id', component: AuthGuestComponent},
  {path: '**', redirectTo: 'auth'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
