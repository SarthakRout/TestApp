export class User {
  constructor(
    public email: string,
    public id: string,
    // tslint:disable-next-line: variable-name
    private _refresh_token: string,
    // tslint:disable-next-line: variable-name
    private _token: string,
    public tokenExpirationDate: Date,
    ) {}

  get token() {
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
  get refresh_token(){
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return null;
    }
    return this._refresh_token;
  }

  updateUser(newRefeshToken: string, expiresIn: string, idToken: string){
    this._refresh_token = newRefeshToken;
    this.tokenExpirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    this._token = idToken;

  }
}
export interface UserDetail {
  email: string;
  name: string;
  role: string;
  adminId: string;
  password: string;
  roll: string;
}
