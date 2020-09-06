import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { Question } from 'src/app/models/question.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { Answer } from 'src/app/models/answer.model';

@Component({
  selector: 'app-admin-show-questions',
  templateUrl: './admin-sq.component.html'
})
export class AdminShowQuestionsComponent implements OnInit{
  @Input() operation = 'Delete';
  adminID = '';
  rowcolors = ['lightgray', 'white'];
  responses: Array<number> = [];
  Questions: Question[] = [];
  testQuestions: Question[] = [];
  nullAns: Answer = new Answer(-1, []);
  testAnswers: Answer[] = [];
  @Output() testQuestionEmitter = new EventEmitter<Question>();
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router){}

  ngOnInit(){
    const user = this.authService.currentUser;
    const userDetail = this.authService.currentUserDetail;
    if ((user !== null) && (userDetail.role === 'admin')) {
      this.adminID = this.authService.currentUser.id;
      this.dataService.getQuestions(this.adminID).subscribe(
        (res: Question[]) => {
          this.Questions = res ;
          if (this.Questions != null) {
            this.responses = new Array(this.Questions.length).fill(0);
            this.testAnswers = new Array(this.Questions.length).fill(this.nullAns);
          }
        },
        err => {
          this.router.navigate(['/']);
        }
      );
    } else {
      this.router.navigate(['/', 'auth']);
    }

  }
  Delete(position: number) {
    // Splice and Slice are different
    this.Questions.splice(position, 1);
    this.dataService.updateQuestions(position, this.adminID).subscribe(
      res => {
        // console.log(res);
      },
      err => {
        // console.log(err);
      }
    );
  }
  ComponentOp(position: number) {
    switch (this.operation) {
      case 'Delete' : {
        this.Delete(position);
        return;
      }
      case 'Add' : {
        this.testQuestionEmitter.emit(this.Questions[position]);
        // console.log('Adding at :', position);
        return;
      }
    }
  }
  GetAnswer(questionId: number){
    this.dataService.getObjectById(this.adminID, questionId, 'answers').subscribe(
      (res: Answer) => {
        // console.log(res);
        this.testAnswers[questionId] = res;
      },
      err => {
        // console.log('Error');
      }
    );
  }
  selectOption(event: any, question: number, answer: number){
    const value = (this.responses[question] === answer + 1) ? false : true;
    if (event.target.type === 'radio') {
      event.target.checked = value;
    }
    else {
      event.target.previousSibling.checked = value;
    }
    if (value) {
      this.responses[question] = answer + 1;
    }
    else{
      this.responses[question] = 0;
    }
  }
  Toggle(event: any) {
    if (event.target.localName === 'h5') {
      if (event.target.parentElement.nextSibling.style.display === 'none') {
        event.target.parentElement.nextSibling.style.display = 'block';
      } else {
        event.target.parentElement.nextSibling.style.display = 'none';
      }
    }
    else {
      if (event.target.nextSibling.style.display === 'none') {
        event.target.nextSibling.style.display = 'block';
      } else {
        event.target.nextSibling.style.display = 'none';
      }
    }
  }
}
