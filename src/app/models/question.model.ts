export class Question {
  constructor(
    public id: number,
    public statement: string,
    public options: string[],
    public images: string[],
  ){}
}
