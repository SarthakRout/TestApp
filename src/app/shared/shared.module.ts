import { NgModule } from '@angular/core';
import { HelpComponent } from './help/help.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AppFooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    HelpComponent,
    HeaderComponent,
    LoadingSpinnerComponent,
    AppFooterComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    HelpComponent,
    LoadingSpinnerComponent,
    AppFooterComponent,
    RouterModule
  ]
})
export class SharedModule {

}
