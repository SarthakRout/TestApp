import { Injectable } from '@angular/core';
import { Question } from '../models/question.model';
import { TestPrototypeModel } from '../models/test.model';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Answer } from '../models/answer.model';

@Injectable()
export class DataService {

  nextPos = 0;
  projectURL = '[Redacted]';
  // Remotely store them Questions: Question[] = null;
  // Tests: TestPrototypeModel[] = null;

  constructor( public http: HttpClient ){}

  getNextPos(adminId: string, path: string){
    return this.http.get(this.projectURL + adminId + '/' + path +  '/nextPos.json');
  }

  getObjectById(adminId: string, id: number, path: string){
    return this.http.get(this.projectURL + adminId + '/' + path + '/data/' + id.toString() + '.json');
  }

  getQuestions(adminId: string){
    return this.http.get(this.projectURL + adminId + '/questions/data.json');
  }

  updateTestPrototypes(test: TestPrototypeModel, adminId: string) {
    this.http.put(this.projectURL + adminId + '/tests/data/' + (test.id).toString() + '.json', test).subscribe(
      res => {}, err => {}
    );
  }
  saveTestPrototype(test: TestPrototypeModel, adminId: string){
    this.updateData(adminId, 'tests', test);
    this.http.patch(this.projectURL + adminId + '/testresponses.json', {
      nextPos: test.id + 1
    }).subscribe(
      res => {}, err => {}
    );
  }

  updateData(adminId: string, path: string, data: any){
    this.http.put(this.projectURL + adminId + '/' + path + '/data/' + (data.id).toString() + '.json', data).subscribe(
      res => {}, err => {}
    );
    // Update nextPos
    this.http.patch(this.projectURL + adminId + '/'  + path  + '.json', {
      nextPos: data.id + 1
    }).subscribe(
      res => {}, err => {}
    );
  }
  saveQuestion(question: Question, adminId: string){
    const questionObject = {
      id: question.id,
      statement: question.statement,
      options: question.options,
      images: question.images
    };
    this.updateData(adminId, 'questions', questionObject);
  }

  saveAnswers(answer: Answer, adminId: string){
    const answerObject = {
      id: answer.id,
      answers: answer.answers
    };
    this.updateData(adminId, 'answers', answerObject);
  }

  submitTest(testData: any, adminId: string, nextPos: number){
    // console.log(testData);
    this.http.patch(this.projectURL + adminId + '/testresponses/' + testData.testId + '.json', {
      nextPos: nextPos + 1
    }).subscribe(
      res => {
        // console.log(res);
      }, err => {
        // console.log(err);
      }
    );
    this.http.put(this.projectURL + adminId + '/testresponses/' + testData.testId + '/data/' + nextPos.toString() + '.json', testData)
    .subscribe(
      res => {
        // console.log(res);
      },
      err => {
        // console.log(err);
      }
    );
    // console.log('Sent to Server!');
  }

  saveUserDetail(id: string, email: string, name: string, role: string , adminId: string, password: string, roll: string){
    const postData = {
     email,
     name,
     role,
     adminId,
     password,
     roll
    };
    this.http.put(this.projectURL + 'users/' +  id + '.json', postData)
    .pipe(
      catchError(this.errorHandler)
    )
    .subscribe(
      res => { // console.log('Register Success!');
      // console.log(res);
      }
      ,
      err => { // console.log('Register Error!');
      // console.log(err);
      }
    );

  }
  errorHandler(error: any){
    // console.log(error);
    return throwError(error);
  }
  retrieveUserDetail(id: string){
    return this.http.get(this.projectURL + 'users/' + id + '.json') ;
  }

  updateQuestions(position: number, adminId: string){
    return this.http.delete(this.projectURL + adminId + '/questions/data/' + position.toString() + '.json');
  }

  getTestPrototypes(adminId: string){
    return this.http.get(this.projectURL + adminId + '/tests/data.json');
  }

  getNextTestPos(testData: any , adminId: string){
    return this.http.get(this.projectURL + adminId + '/testresponses/' + testData.testId + '/nextPos.json');
  }

  // tslint:disable-next-line: variable-name
  saveScore(Name: string, Score: number, Responses: string[], Time_Taken: string){
    const sheetURL = '[Redacted]';
    const jsonObj = {
      Name,
      Score: Score.toString(),
      Responses: JSON.stringify(Responses),
      Time_Taken
    };
    // console.log(jsonObj);
    this.http.get(sheetURL, {params: jsonObj}).subscribe(
      res => {
        // console.log(res);
      },
      err => {
        // console.log(err);
      }
    );
  }
}
