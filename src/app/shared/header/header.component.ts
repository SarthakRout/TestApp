import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  constructor(public router: Router, public authService: AuthService){}
  ngOnInit(){
    if (!!this.authService.currentUser) {
      this.isLoggedIn = true;
    }
  }
}
