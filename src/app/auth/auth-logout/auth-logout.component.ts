import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-logout',
  templateUrl: './auth-logout.component.html',
})
export class AuthLogoutComponent implements OnInit, OnDestroy{
  logSub: any;
  constructor(private router: Router, private authService: AuthService){}
  ngOnInit(){
    localStorage.clear();
    this.authService.currentUser = null;
    this.authService.currentUserDetail = null;
    this.authService.isLoggedIn.emit(false);
    this.logSub = setTimeout(() => {
      this.router.navigate(['/', 'auth']);
    }, 1000);
  }
  ngOnDestroy(){
    if (this.logSub != null) {
      clearTimeout(this.logSub);
      this.logSub = null;
    }
  }
}
