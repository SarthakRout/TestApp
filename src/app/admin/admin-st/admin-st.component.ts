import { Component, OnInit } from '@angular/core';
import { TestPrototypeModel } from 'src/app/models/test.model';
import { DataService } from 'src/app/shared/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-show-tests',
  templateUrl: './admin-st.component.html',
  styleUrls: ['./admin-st.component.css']
})
export class AdminShowTestsComponent implements OnInit{
  adminID = '';
  TestPrototypes: TestPrototypeModel[] = null;
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router){}
  ngOnInit(){
    const user = this.authService.currentUser;
    const userDetail = this.authService.currentUserDetail;
    if ((user !== null) && (userDetail.role === 'admin')) {
      this.adminID = this.authService.currentUser.id;
    } else {
      this.router.navigate(['/', 'auth']);
    }
    // Get Test Prototypes
    this.dataService.getTestPrototypes(this.adminID).subscribe(
      (res: TestPrototypeModel[]) => {
        // console.log(res);
        this.TestPrototypes = res;
      },
      err => {
        // console.log(err);
      }
    );
  }
  Toggle(position: number) {
    this.TestPrototypes[position].options.isActive = !this.TestPrototypes[position].options.isActive;
    this.dataService.updateTestPrototypes(this.TestPrototypes[position], this.adminID);
    // Tell this to service too.
  }
}
