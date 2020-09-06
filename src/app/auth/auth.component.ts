import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { DataService } from '../shared/data.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit{
  constructor(
    private authService: AuthService,
    private router: Router
    ){}
  ngOnInit(){
    const user = this.authService.currentUser;
    const userDetail = this.authService.currentUserDetail;
    if (user !== null){
      if (userDetail.role === 'admin') {
        this.router.navigate(['/', 'admin']);
      } else {
        this.router.navigate(['/', 'tests', 'start']);
      }
    }
    else {
      // console.log('Allow to Login/Register/Guest!');
    }
  }
}
