import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AdminMakeQuestionComponent } from './admin-mq/admin-mq.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminMakeTestComponent } from './admin-mt/admin-mt.component';
import { AdminShowQuestionsComponent } from './admin-sq/admin-sq.component';
import { AdminShowTestsComponent } from './admin-st/admin-st.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminMakeQuestionComponent,
    AdminMakeTestComponent,
    AdminShowQuestionsComponent,
    AdminShowTestsComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    AdminRoutingModule,
    RouterModule
  ],
  exports: [
    AdminMakeQuestionComponent,
    AdminMakeTestComponent,
    AdminShowQuestionsComponent,
    AdminShowTestsComponent,
    RouterModule
  ]
})
export class AdminModule {

}
