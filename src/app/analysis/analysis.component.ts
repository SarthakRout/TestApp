import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Test, TestPrototypeModel } from '../models/test.model';
import { DataService } from '../shared/data.service';
import { Question } from '../models/question.model';
import { Answer } from '../models/answer.model';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit{
  testPrototype: TestPrototypeModel = null;
  isLoading = true;
  test: Test = null;
  adminId = '';
  testId = 0;
  testAnswers: Answer[] = [];
  rowcolors = ['lightgray', 'white'];

  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService, private router: Router){}
  ngOnInit(){
    this.testId = this.activatedRoute.snapshot.params.testId;
    this.adminId = this.activatedRoute.snapshot.params.adminId;
    this.dataService.getObjectById(this.adminId, this.testId, 'tests').subscribe(
      res => {
        this.testPrototype = res as TestPrototypeModel;
        if (this.testPrototype.options.showAnalysis !== true) {
          this.router.navigate(['/', 'auth']);
        }
        this.test = this.convertToTest(this.testPrototype);
      },
      err => {
        this.isLoading = false;
        console.log(err);
      }

    );
  }
  GetAnswer(questionId: number){
    this.dataService.getObjectById(this.adminId, questionId, 'answers').subscribe(
      (res) => {
        this.testAnswers[questionId] = res as Answer;
      },
      err => {
        // console.log('Error');
      }
    );
    if (questionId === this.testPrototype.questionids[this.testPrototype.questionids.length - 1]){
      this.isLoading = false;
    }
  }
  convertToTest(TestPrototype: TestPrototypeModel){
    const questions: Question[] = [];
    const nullQuestion = new Question(-1, '', [], []);
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < TestPrototype.questionids.length; j++){
      questions.push(nullQuestion);
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < TestPrototype.questionids.length; i++) {
      this.dataService.getObjectById(this.adminId, TestPrototype.questionids[i], 'questions').subscribe(
        (res: Question) => {
          questions[i] = res;
          this.GetAnswer(res.id);
        },
        err => {
          // console.log(err);
        }
      );
    }
    const newTest = new Test(
      TestPrototype.id,
      TestPrototype.name,
      TestPrototype.duration,
      TestPrototype.startafter,
      TestPrototype.startbefore,
      questions,
      TestPrototype.options
    );
    return newTest;
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
