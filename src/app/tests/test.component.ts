import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{
  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute) {}
  ngOnInit(){
    const user = this.authService.currentUser;
    if (user === null) {
      localStorage.clear();
      this.router.navigate(['/', 'auth']);
    } else {
      const testData = JSON.parse(localStorage.getItem('test_data'));
      if (testData === null ){
        this.router.navigate(['tests', 'start']);
      }
      else if (new Date(testData.end_by).getTime() < new Date().getTime()) {
        localStorage.removeItem('test_data');
        this.router.navigate(['/', 'auth']);
      } else {
        this.router.navigate(['tests/', (testData.id).toString]);
      }
    }
  }
}
