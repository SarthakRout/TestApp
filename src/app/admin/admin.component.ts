import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  AdminName = 'Admin';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
    ) {}

  ngOnInit() {
    if ((this.authService.currentUser === null)){
      this.router.navigate(['/', 'auth']);
    } else if (this.authService.currentUserDetail.role !== 'admin') {
      this.router.navigate(['/', 'tests']);
    }
    else{
      this.AdminName = this.authService.currentUserDetail.name;
    }
  }
  ShowBuilder(navigateTo: string){
    this.router.navigate([navigateTo], {relativeTo: this.route });
  }
}
