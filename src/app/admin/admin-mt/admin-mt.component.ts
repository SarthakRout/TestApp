import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/models/question.model';
import { FormControl } from '@angular/forms';
import flatpickr from 'flatpickr';
import { TestPrototypeModel, Options } from 'src/app/models/test.model';
import { AuthService } from 'src/app/auth/auth.service';
import { DataService } from 'src/app/shared/data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-make-test',
  templateUrl: './admin-mt.component.html',
  styleUrls: ['./admin-mt.component.css']
})
export class AdminMakeTestComponent implements OnInit {
  nextPos = 0;
  adminID = '';

  fpAfter = null;
  fpBefore = null;

  name = new FormControl('');
  duration = new FormControl('');
  after = new FormControl('');
  before = new FormControl('');
  isTestActive = new FormControl(true);
  maxAttempts = new FormControl(1);
  toShowScores = new FormControl(true);
  toShowAnswers = new FormControl(true);

  testQuestions: Question[] = [];
  testQuestionIds: number[] = [];
  responses: Array<number> = [];
  rowcolors = ['lightgray', 'white'];

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    ){}
  ngOnInit(){
    const user = this.authService.currentUser;
    const userDetail = this.authService.currentUserDetail;
    if ((user !== null) && (userDetail.role === 'admin')) {
      this.adminID = this.authService.currentUser.id;
    } else {
      this.router.navigate(['/', 'auth']);
    }

    this.dataService.getNextPos(this.adminID, 'tests').subscribe(
      (res: number) => {
        this.nextPos = res as number;
      },
      err => {
        // console.log(err);
      }
    );
    const elemRefAfter = document.querySelector('#dateStartAfter');
    this.fpAfter = flatpickr(elemRefAfter, {
      altInput: true,
      minDate: 'today',
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      onClose(selectedDates, dateStr, instance) {
        if (selectedDates.length === 1){
          if ((this.startBefore !== null ) && (this.startBefore < selectedDates[0])){
            alert('The start-before date will come after start-after date');
            return;
          }
        }
      },
    });
    const elemRefBefore = document.querySelector('#dateStartBefore');
    this.fpBefore = flatpickr(elemRefBefore, {
      altInput: true,
      minDate: 'today',
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      onClose(selectedDates, dateStr, instance) {
        if (selectedDates.length === 1){
          if ((this.startAfter !== null ) && (this.startAfter > selectedDates[0])){
            alert('The start-before date will come after start-after date');
            return;
          }
        }
      },
    });
  }
  tests(question: any){
    this.testQuestions.push(question);
    this.testQuestionIds.push(question.id);
    this.responses.push(0);
  }
  selectOption(event: any, question: number, answer: number){
    const value = (this.responses[question] === answer + 1) ? false : true;
    if (event.target.type === 'radio') {
      event.target.checked = value;
    }
    else {
      if (event.target.previousSibling.type === 'radio') {
       event.target.previousSibling.checked = value;
      }
      else{
        return;
      }
    }
    if (value) {
      this.responses[question] = answer + 1;
    }
    else{
      this.responses[question] = 0;
    }
  }
  ToggleBtn(attribute: string){
    switch (attribute) {
      case 'active' : {
        this.isTestActive.setValue(!this.isTestActive.value);
        return;
      }
      case 'scores' : {
        this.toShowScores.setValue(!this.toShowScores.value);
        return;
      }
      case 'answers' : {
        this.toShowAnswers.setValue(!this.toShowAnswers.value);
        return;
      }
    }
  }
  Toggle(event) {
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
  SaveTest(){
    const newTestPrototype: TestPrototypeModel = {
      id: this.nextPos,
      name: this.name.value,
      duration: this.duration.value,
      startafter: Date.parse(this.after.value),
      startbefore: Date.parse(this.before.value),
      questionids: this.testQuestionIds,
      options: new Options(
        this.isTestActive.value,
        this.maxAttempts.value,
        this.toShowScores.value,
        this.toShowAnswers.value,
        false
        )
    };
    this.dataService.saveTestPrototype(newTestPrototype, this.adminID);
    this.nextPos = this.nextPos + 1;
    this.ClearTest();
  }
  ClearTest(){
    this.testQuestions = [];
    this.testQuestionIds = [];
    this.name.reset();
    this.duration.reset();
    this.fpAfter.clear();
    this.fpBefore.clear();
    this.after.reset();
    this.before.reset();
    this.isTestActive.setValue(true);
    this.maxAttempts.setValue(1);
    this.toShowAnswers.setValue(true);
    this.toShowScores.setValue(true);
  }

}
