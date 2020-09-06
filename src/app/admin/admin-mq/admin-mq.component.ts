import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, } from '@angular/forms';
import { Question } from 'src/app/models/question.model';
import { DataService } from 'src/app/shared/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { Answer } from 'src/app/models/answer.model';

@Component({
  selector: 'app-admin-make-question',
  templateUrl: './admin-mq.component.html',
  styleUrls: ['./admin-mq.component.css']
})
export class AdminMakeQuestionComponent implements OnInit {
  question: FormGroup;
  nextPos = 1;
  adminID = '';
  answer = new FormControl('');
  answers: string[] = [];
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router){}

  ngOnInit(){
    this.question = new FormGroup({
      statement: new FormControl(''),
      options: new FormArray([]),
      optiondata: new FormControl(''),
      imageSrcs: new FormArray([]),
      imageSrcdata: new FormControl('')
    });
    const user = this.authService.currentUser;
    const userDetail = this.authService.currentUserDetail;
    if ((user !== null) && (userDetail.role === 'admin')) {
      this.adminID = this.authService.currentUser.id;
    } else {
      this.router.navigate(['/', 'auth']);
    }
    this.dataService.getNextPos(this.adminID, 'questions').subscribe(
      res => {
        // console.log(res);
        this.nextPos = res as number;
      },
      err => {
        // console.log(err);
      }
    );
  }

  getArray(name: string) {
    return (this.question.get(name) as FormArray);
  }
  Add(data: string) {
    // Best Original Thought Here: Directly pushing a formcontrol pushes a reference (remember C pointers?)
    // So, you have to create a new form-control
    const dataToAdd = new FormControl(this.question.get(data + 'data').value);
    this.getArray(data + 's').push(dataToAdd);
    this.question.get(data + 'data').setValue('');
  }
  Delete(data: string, position: number) {
    this.getArray(data + 's').removeAt(position);
  }
  Save(){
    const questionsNow = this.question.value;
    // console.log(questionsNow);
    const newQuestion = new Question(
      this.nextPos,
      this.question.get('statement').value,
      this.question.get('options').value,
      this.question.get('imageSrcs').value
    );
    this.dataService.saveQuestion(newQuestion, this.adminID);
    const newAnswer = new Answer(
      this.nextPos,
      this.answers
    );
    // console.log(newAnswer);
    this.dataService.saveAnswers(newAnswer, this.adminID);
    this.nextPos = this.nextPos + 1;
    this.Clear();
  }
  Clear() {
    this.getArray('options').clear();
    this.getArray('imageSrcs').clear();
    this.answers.splice(0);
    this.answer.setValue('');
    this.question.reset();
  }
  getoption(x: any){
    return x as FormControl;
  }
  AddAnswer(){
    this.answers.push(this.answer.value);
  }
  DeleteAnswer(position: number){
    this.answers.splice(position, 1);
  }
}
