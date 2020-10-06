import { Component, OnInit } from '@angular/core';
import { TestPrototypeModel } from '../../models/test.model';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { AuthService } from '../../auth/auth.service';
import { DataService } from '../../shared/data.service';
import * as AES from 'crypto-js/aes';
const encryptionKey = 'supersecretkey';		// CHANGE TO REAL ENVIRONMENT VARIABLE

@Component({
  selector: 'app-test-start',
  templateUrl: './test-start.component.html',
  styleUrls: ['./test-start.component.css']
})
export class TestStartComponent implements OnInit {
  groupId = '';
  user: User = null;
  testStarted = false;
  TestPrototypes: TestPrototypeModel[];
  responses: Array<number> = null;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private dataService: DataService){
  }
  ngOnInit(){
    const currentUser = this.authService.currentUser;
    const currentUserDetail = this.authService.currentUserDetail;
    if (currentUser == null) {
      this.router.navigate(['/', 'auth']);
    } else {
      this.user = currentUser;
    }
    // Get All Test Prototypes
    // console.log(currentUserDetail);
    this.dataService.getTestPrototypes(currentUserDetail.adminId).subscribe(
      (res: any) => {
        // console.log(res);
        this.TestPrototypes = res;
        this.rectify();
      },
      err => {
        // console.log(err);
      }
    );
  }
  startTest(id: number){
    this.responses = new Array(this.TestPrototypes[id].questionids.length).fill(0);
    // tslint:disable-next-line: variable-name
    const test_data = {
      name: this.authService.currentUserDetail.name,
      localId: this.authService.currentUser.id,
      testId: this.TestPrototypes[id].id,
      end_by: this.TestPrototypes[id].duration * 60 * 1000 + Date.now(),
      email: this.user.email,
      responses: this.responses
    };
		// Encrypt initial test data
		const stringifiedTestData : string = JSON.stringify(test_data);
		//console.log(stringifiedTestData);
		const encryptedData : string = AES.encrypt(stringifiedTestData, encryptionKey)

    localStorage.setItem('test_data', encryptedData);
    // console.log(this.activatedRoute);
    this.router.navigate(['../', id], {relativeTo: this.activatedRoute});
  }
  rectify(){
    const timeNow = Date.now();
    if (this.TestPrototypes === null) {
      return;
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i  = 0; i < this.TestPrototypes.length; i++) {
      if ((timeNow < this.TestPrototypes[i].startafter) || (timeNow > this.TestPrototypes[i].startbefore)) {
        this.TestPrototypes[i].options.isActive = false;
      }
    }
  }
}
