import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './test.component';
import { TestStartComponent } from './test-start/test-start.component';
import { TestMainComponent } from './test-main/test-main.component';
import { TestEndComponent } from './test-end/test-end.component';

const routes: Routes = [
  {
    path: 'tests',
    component: TestComponent,
    children: [
      {path: 'start', component: TestStartComponent},
      {path: 'end', component: TestEndComponent},
      {path: ':id', component: TestMainComponent}
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class TestRoutingModule {

}
