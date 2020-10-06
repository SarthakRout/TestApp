import { Component, OnInit} from '@angular/core';
import { Test, TestPrototypeModel, Options } from '../../models/test.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../shared/data.service';
import { AuthService } from '../../auth/auth.service';
import { User, UserDetail } from '../../models/user.model';
import { Question } from '../../models/question.model';
import * as CryptoJS from 'crypto-js';
const encryptionKey = 'supersecretkey';		// CHANGE TO REAL ENVIRONMENT VARIABLE

@Component({
  selector: 'app-test-main',
  templateUrl: './test-main.component.html',
  styleUrls: ['./test-main.component.css']
})
export class TestMainComponent implements OnInit {
  showSpinner = false;
  userData: UserDetail = null;
  TestPrototype: TestPrototypeModel = null;
  Test: Test = new Test(
    -1,
    '',
    1,
    (new Date().getTime() - 10000),
    (new Date().getTime() + 10000),
    [], new Options(true, 1, true, true)
    );
  responses: Array<number> = null;
  rowcolors = ['lightgray', 'white'];
  counter = 0;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService){}
  ngOnInit(){
    this.showSpinner = true;
    // Learn Async Await cycle
    this.userData = this.authService.currentUserDetail;
  	
		// Decrypt initial test data
		const encrypted = localStorage.getItem('test_data');
		const decryptedTestData : string  = CryptoJS.AES.decrypt(localStorage.getItem('test_data'), encryptionKey).toString(CryptoJS.enc.Utf8);
   	var testData = JSON.parse(decryptedTestData);

		const user = this.authService.currentUser;
    if (user == null) {
      localStorage.clear();
      this.router.navigate(['/', 'auth']);
    }
    if ((testData !== null) && (testData.email) === user.email) {
      this.dataService.getObjectById(this.userData.adminId , testData.testId , 'tests')
      .subscribe(
        (res: TestPrototypeModel) => {
          this.TestPrototype = res;
          this.responses = testData.responses;
          this.Test = this.convertToTest(this.TestPrototype);
          this.Test.duration = (testData.end_by - new Date().getTime()) / 60000;

          this.counter = this.Test.duration * 60;
          this.counter = (this.counter - this.counter % 1);
          const timerr = setInterval(
          () => {
            if (this.counter === 0) {
              clearInterval(timerr);
              this.submitTest();
            } else {
              this.counter = this.counter - 1;
            }
          }, 1000);

        },
        err => {
          console.log(err);
        }
      );

    } else {
      this.dataService.getObjectById(this.userData.adminId, this.activatedRoute.snapshot.params.id, 'tests')
      .subscribe(
        (res: TestPrototypeModel) => {
          this.TestPrototype = res;
          this.Test = this.convertToTest(this.TestPrototype);

          this.responses = new Array(this.Test.questions.length).fill(0);
          this.counter = this.Test.duration * 60;
          this.counter = (this.counter - this.counter % 1);
          this.showSpinner = false;
          const timerr = setInterval(
          () => {
            if (this.counter === 0) {
              clearInterval(timerr);
              this.submitTest();
            } else {
              this.counter = this.counter - 1;
            }
          }, 1000);

        },
        err => {
         // console.log(err);
        }
      );
    }
  }
  populateAll(){
    // tslint:disable-next-line: prefer-for-of
    const questions = this.Test.questions;
    for (let i = 0; i < this.TestPrototype.questionids.length; i++){
      for (let j = 0; j < questions[i].options.length; j++) {
        // console.log(questions[i].options);
        if (this.responses[i] === j + 1)
        {
          (document.getElementById('input' + i.toString() +  '-' +  j.toString()) as HTMLInputElement).checked = true;
          break;
        }
      }
    }
    this.showSpinner = false;

  }
  convertToTest(testPrototype: TestPrototypeModel){
    let count = 0;
    const questions: Question[] = [];
    const nullQuestion = new Question(-1, '', [], []);
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < testPrototype.questionids.length; j++){
      questions.push(nullQuestion);
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < testPrototype.questionids.length; i++) {
      this.dataService.getObjectById(this.userData.adminId, testPrototype.questionids[i], 'questions').subscribe(
        (res: Question) => {
          questions[i] = res;
          count = count + 1;
          if (count === testPrototype.questionids.length ){
            this.populateAll();
          }
        },
        err => {
          // console.log(err);
        }
      );
    }
    const newTest = new Test(
      testPrototype.id,
      testPrototype.name,
      testPrototype.duration,
      testPrototype.startafter,
      testPrototype.startbefore,
      questions,
      testPrototype.options
    );
    return newTest;
  }
  selectOption(event: any, question: number, answer: number){
    const value = (this.responses[question] === answer + 1) ? false : true;
    // console.log(event);
    const elemRef: any = document.getElementById('input' + question.toString() + '-' + answer.toString());
    if (value) {
      elemRef.checked = true;
      this.responses[question] = answer + 1;
    } else {
      elemRef.checked = false;
      this.responses[question] = 0;
    }
    // console.log(elemRef);

		// Decrypt data before parsing
		const decryptedTestData : string = CryptoJS.AES.decrypt(localStorage.getItem('test_data'), encryptionKey).toString(CryptoJS.enc.Utf8);
    const testData = JSON.parse(decryptedTestData);
    
		// Encrypt and store test data
		testData.responses = this.responses;
		const encryptedTestData : string = CryptoJS.AES.encrypt(JSON.stringify(testData),encryptionKey);
    localStorage.setItem('test_data',encryptedTestData);
  }

  submitTest(){
    let nextPos = 0;
    const confirmSubmit  = true ;
    if (confirmSubmit) {
    	// console.log('Test Submitted!');
     
			// Decrypt data before parsing
			const decryptedTestData : string = CryptoJS.AES.decrypt(localStorage.getItem('test_data'), encryptionKey).toString(CryptoJS.enc.Utf8);
			
			const testData = JSON.parse(decryptedTestData);
      testData.end_by = Date.now();
      const adminId = this.authService.currentUserDetail.adminId;
      this.dataService.getNextTestPos(testData, adminId).subscribe(
        (res: number) => {
          nextPos = res;
          this.dataService.submitTest(testData, adminId, res);
        },
        err => {
          // console.log(err);
        }
      );
      // console.log(this.responses);
      localStorage.setItem('time_taken', (this.Test.duration * 60 - this.counter).toString());
      this.router.navigate(['../', 'end'], {relativeTo: this.activatedRoute});
    }
  }
}
