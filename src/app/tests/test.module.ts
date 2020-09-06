import { NgModule } from '@angular/core';
import { TestStartComponent } from './test-start/test-start.component';
import { TestMainComponent } from './test-main/test-main.component';
import { TestEndComponent } from './test-end/test-end.component';
import { TestComponent } from './test.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestRoutingModule } from './test-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    TestComponent,
    TestStartComponent,
    TestMainComponent,
    TestEndComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TestRoutingModule,
    SharedModule
  ],
  exports: [
    RouterModule,
    TestComponent,
    TestStartComponent,
    TestMainComponent,
    TestEndComponent,
  ]
})
export class TestModule{

}
