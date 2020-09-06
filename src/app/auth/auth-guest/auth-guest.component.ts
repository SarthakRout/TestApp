import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from 'src/app/shared/data.service';
import { TestPrototypeModel } from 'src/app/models/test.model';

@Component({
  selector: 'app-guest',
  templateUrl: './auth-guest.component.html',
  styleUrls: ['./auth-guest.component.css']
})
export class AuthGuestComponent implements OnInit{
  adminId = '';
  testId = '';
  testToGive: TestPrototypeModel = null;
  myGuestForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private dataService: DataService,
    private router: Router){}
  ngOnInit(){
    this.myGuestForm = new FormGroup({
      name: new FormControl('', Validators.required),
      roll_no: new FormControl(1, Validators.min(1)),
      email: new FormControl('', Validators.email),
    });
    this.adminId = this.route.snapshot.params.adminId;
    this.testId = this.route.snapshot.params.id;
    this.dataService.getObjectById(this.adminId, +this.testId, 'tests').subscribe(
      (res: TestPrototypeModel) => {
        this.testToGive = res;
        if ((this.testToGive === null ) || (this.testToGive.options.isActive === false)) {
          this.router.navigate(['/auth']);
        }
      },
      err => {
        this.router.navigate(['/auth']);
        // console.log(err);
      }
    );
  }
  onSubmit(){
    const name = this.myGuestForm.get('name').value;
    const rollNo = this.myGuestForm.get('roll_no').value;
    const email = this.myGuestForm.get('email').value;
    this.authService.anonymousSignUp(
      this.adminId,
      name,
      rollNo,
      email,
      this.testId,
      this.testToGive.questionids.length,
      this.testToGive.duration
    );
  }
}
