import { Question } from './question.model';
export class Options {
  constructor(
    public isActive: boolean = true,
    public maxAttempts: number = 1,
    public showScore: boolean = true,
    public showAnswers: boolean = true,
    public showAnalysis?: boolean,
    // public shuffleQuestions: boolean = false,
  ){}
}
export class TestPrototypeModel {
  constructor(
    public id: number,
    public name: string,
    public duration: number,
    public startafter: number,
    public startbefore: number,
    public questionids: number[],
    public options: Options,
  ){}
}
export class Test {
  constructor(
    public id: number,
    public name: string,
    public duration: number,
    public startafter: number,
    public startbefore: number,
    public questions: Question[],
    public options: Options
  ){}
}
