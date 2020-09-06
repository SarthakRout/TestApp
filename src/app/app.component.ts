import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { User } from './models/user.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'TestApp';
  logSub: any;
  constructor(private authService: AuthService){}
  ngOnInit(){
    this.authService.isLoggedIn.emit(false);
    this.authService.AutoLogin();
    this.authService.isLoggedIn.subscribe(
      (status: boolean) => {
        if (status === true) {
          this.logSub = setTimeout(() => {
            this.authService.refreshUser();
          }, 3600 * 1000 * 0.9);
        }
      }
    );
  }
  ngOnDestroy() {
    clearTimeout(this.logSub);
  }

}
