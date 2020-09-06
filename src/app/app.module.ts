import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthModule } from './auth/auth.module';
import { TestModule } from './tests/test.module';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { DataService } from './shared/data.service';
import { AnalysisComponent } from './analysis/analysis.component';


@NgModule({
  declarations: [
    AppComponent,
    AnalysisComponent
  ],
  imports: [
    BrowserModule,
    TestModule,
    ReactiveFormsModule,
    FormsModule,
    AuthModule,
    SharedModule,
    HttpClientModule,
    AdminModule,
    AppRoutingModule, // Always at end of the file
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
