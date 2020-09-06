import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TestPrototypeModel, Options } from '../../models/test.model';
import { DataService } from '../../shared/data.service';
import { Answer } from 'src/app/models/answer.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-test-end',
  templateUrl: './test-end.component.html',
  styleUrls: ['./test-end.component.css']
})
export class TestEndComponent implements OnInit{
  len = 0;
  score = 0;
  test: TestPrototypeModel = new TestPrototypeModel(
    -1,
    '',
    1,
    (new Date().getTime() - 10000),
    (new Date().getTime() + 10000),
    [], new Options(true, 1, true, true)
    );
  guest = false;
  testname = '';
  responses: string[] = [];
  answers: Answer[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService){}
  ngOnInit(){
    const testdata = localStorage.getItem('test_data');
    const userdata = localStorage.getItem('currentUserDetail');
    if (!!testdata) {
      const timeTaken = localStorage.getItem('time_taken');
      const id =  JSON.parse(testdata).testId;
      this.responses = JSON.parse(testdata).responses;
      const user = JSON.parse(userdata);
      localStorage.removeItem('test_data');
      this.dataService.getObjectById(user.adminId, id as number, 'tests').subscribe(
        (res: TestPrototypeModel) => {
          this.test = res;
          // tslint:disable-next-line: prefer-for-of
          for (let i  = 0; i < res.questionids.length; i++) {
            this.dataService.getObjectById(user.adminId, res.questionids[i] , 'answers').subscribe(
              (resl: Answer) => {
                this.answers.push(resl);
                this.len = this.len  + 1;
                if (resl.answers.includes(this.responses[i].toString())) {
                  this.score = this.score + 1;
                }
                if (i === res.questionids.length - 1) {
                  this.dataService.saveScore(user.name, this.score, this.responses, timeTaken);
                }
              },
              err => {
              }
            );
          }
        },
        err => {

        }
      );
      // Mark test as not available at the server
      if (user.password === 'absent') {
        localStorage.clear();
        this.authService.currentUser = null;
        this.authService.currentUserDetail = null;
        this.authService.isLoggedIn.emit(false);
        this.guest = true;
      }
    }
  }
  goToTests(){
    this.router.navigate(['../', 'start'], {relativeTo: this.route});
  }
  check(){
    // tslint:disable-next-line: prefer-for-of
    // console.log(this.answers);
    for (let i = 0; i < this.test.questionids.length; i++) {
      if (this.answers[i].answers.includes(this.responses[i])) {
        this.score = this.score + 1;
      }
    }
  }
}
