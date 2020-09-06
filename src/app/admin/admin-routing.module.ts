import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AdminComponent } from './admin.component';
import { AdminMakeQuestionComponent } from './admin-mq/admin-mq.component';
import { AdminMakeTestComponent } from './admin-mt/admin-mt.component';
import { AdminShowTestsComponent } from './admin-st/admin-st.component';
import { AdminShowQuestionsComponent } from './admin-sq/admin-sq.component';

const route: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {path: 'makequestion', component: AdminMakeQuestionComponent},
      {path: 'maketest', component: AdminMakeTestComponent},
      {path: 'showquestions', component: AdminShowQuestionsComponent},
      {path: 'showtests', component: AdminShowTestsComponent},
  ]
},

];
@NgModule({
  imports: [
    RouterModule.forChild(route)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
