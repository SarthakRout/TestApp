import { Injectable, Output, EventEmitter } from '@angular/core';
import { User, UserDetail } from '../models/user.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DataService } from '../shared/data.service';
import { SignUpResponse, SignInResponse } from '../models/auth-response.model';
import { Router } from '@angular/router';
import * as AES from 'crypto-js/aes';
const encryptionKey = 'supersecretkey';		// CHANGE TO REAL ENVIRONMENT VARIABLE

interface RefreshResponsePayload {
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
}
@Injectable({providedIn: 'root'})
export class AuthService {
  projectURL = 'https://baluate-74386.firebaseio.com/';
  signUpURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.apiKey ;
  signInURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.apiKey;

  currentUser: User = null;
  currentUserDetail: UserDetail = null;

  @Output() isLoggedIn = new EventEmitter<boolean>();
  constructor(
    public http: HttpClient,
    private dataService: DataService,
    private router: Router){}

  Login(email: string, password: string){
		const postData = {
      email,
      password,
      returnSecureToken: true
    };
    this.http.post(this.signInURL, postData)
    .pipe(
      catchError(this.errorHandler)
    )
    .subscribe(
      res => {
        const data = res as SignInResponse;
        const expirationDate = new Date (new Date().getTime() + +data.expiresIn * 1000);
        this.currentUser = new User(
          email,
          data.localId,
          data.refreshToken,
          data.idToken,
          expirationDate
        );
        this.dataService.retrieveUserDetail(data.localId).subscribe(
          (resl: any) => {
            this.currentUserDetail = resl;
            this.currentUserDetail.password = 'hidden';
            
						// Encrypt data beforing storing it locally
						const encryptedCurrentUser : string  = AES.encrypt(JSON.stringify(this.currentUser), encryptionKey);
						const encryptedCurrentUserDetail : string = AES.encrypt(JSON.stringify(this.currentUserDetail), encryptionKey);
						
						// Save Data in Local Storage
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentUserDetail');
            localStorage.setItem('currentUser', encryptedCurrentUser);
            localStorage.setItem('currentUserDetail', encryptedCurrentUserDetail);

            // console.log(resl);
            if (resl.role === 'admin') {
              this.router.navigate(['/', 'admin']);
            } else {
              this.router.navigate(['/', 'tests', 'start']);
            }
          },
          err => {
            alert('Please try again!');
            this.router.navigate(['/', 'auth']);
          }
        );
        this.isLoggedIn.emit(true);
      },
      err => {
        this.isLoggedIn.emit(false);
        this.router.navigate(['/', 'auth']);
        // console.log('Login Error!');
        // console.log(err);
      }
    );
  }

  Register(email: string, password: string, name: string, adminId: string, roll: string){
		this.http.get(this.projectURL + '/users/' + adminId + '.json').subscribe(
      (res: any) => {
        if ((res === null ) || (res.role !== 'admin')) {
          console.log(res[0]);
          //window.location.reload();
          return;
        }
        else {
          const postData = {
            email,
            password,
            returnSecureToken: true
          };
          this.http.post(this.signUpURL, postData)
          .pipe(
            catchError(this.errorHandler)
          )
          .subscribe(
            resl => {
              const data = resl as SignUpResponse;
              const expirationDate = new Date (new Date().getTime() + +data.expiresIn * 1000);
              this.currentUser = new User(
                email,
                data.localId,
                data.refreshToken,
                data.idToken,
                expirationDate
              );
              this.currentUserDetail = {
                email,
                name,
                role: 'user',
                adminId,
                password: 'hidden',
                roll
              };
							
							// Encrypt data beforing storing it locally
							const encryptedCurrentUser : string = AES.encrypt(JSON.stringify(this.currentUser), encryptionKey);
							const encryptedCurrentUserDetail : string = AES.encrypt(JSON.stringify(this.currentUserDetail), encryptionKey);

							//const encryptedPassword : string = 
              // Save Data in Local Storage
              localStorage.removeItem('currentUser');
              localStorage.removeItem('currentUserDetail');
              localStorage.setItem('currentUser', encryptedCurrentUser);
              localStorage.setItem('currentUserDetail', encryptedCurrentUserDetail);
              this.dataService.saveUserDetail((resl as SignUpResponse).localId, email, name, 'user', adminId, password, roll);
              this.router.navigate(['/', 'tests', 'start']);
              this.isLoggedIn.emit(true);
            }, err => {
              this.isLoggedIn.emit(false);
              alert('Invalid Registration!');
              this.router.navigate(['/', 'auth']);
              // console.log(err);
            }
          );
        }
      },
      err => {
				console.error(err);
        //window.location.reload();

        return;
      }
    );
  }

  anonymousSignUp(adminId: string, name: string, roll: string, email: string, testId: string, length: number, duration: number){
    const expirationDate = new Date (new Date().getTime() + 3600 * 3 * 1000);
    this.currentUser = new User(
          email,
          'anon',
          'anon',
          'anon',
          expirationDate
        );
    this.currentUserDetail = {
          email,
          name,
          role: 'user',
          adminId,
          password: 'absent',
          roll
        };
		// Encrypt data beforing storing it locally
		const encryptedCurrentUser : string = AES.encrypt(JSON.stringify(this.currentUser), encryptionKey);
		const encryptedCurrentUserDetail : string = AES.encrypt(JSON.stringify(this.currentUserDetail), encryptionKey);

    // Save Data in Local Storage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserDetail');
    localStorage.setItem('currentUser', encryptedCurrentUser);
    localStorage.setItem('currentUserDetail', encryptedCurrentUserDetail);

    // this.dataService.saveUserDetail('anon', email, name, 'user', adminId, 'absent', roll);

    const responses = new Array(length).fill(0);
    // tslint:disable-next-line: variable-name
    const test_data = {
      name,
      localId: this.currentUser.id,
      testId,
      end_by: duration * 60 * 1000 + Date.now(),
      email: this.currentUser.email,
      responses
    };
    localStorage.setItem('test_data', JSON.stringify(test_data));
    this.isLoggedIn.emit(true);
    this.router.navigate(['/tests/', testId]);
  }

  AutoLogin(){
		
		// Decrypt data before parsing
		const decryptedCurrentUser : string = AES.decrypt(localStorage.getItem('currentUser'), encryptionKey);
		const decryptedCurrentUserDetail : string = AES.decrypt(localStorage.getItem('currentUserDetail'), encryptionKey);

    const prevObj: any = JSON.parse(decryptedCurrentUser);
    if (prevObj === null){
      this.isLoggedIn.emit(false);
      return 0;
    }
		    
		const prevUser = new User(prevObj.email, prevObj.id, prevObj._refresh_token, prevObj._token, new Date(prevObj.tokenExpirationDate));
    if (prevUser.id === 'anon') {
      this.currentUser = prevUser;
      this.currentUserDetail = JSON.parse(decryptedCurrentUserDetail);
      this.isLoggedIn.emit(true);
      return 1;
    }
    if (prevUser.token === null) {
      localStorage.clear();
      this.isLoggedIn.emit(false);
      return 0;
    }
    else {
      this.currentUser = prevUser;
      this.currentUserDetail = JSON.parse(decryptedCurrentUserDetail);
      this.isLoggedIn.emit(true);
      this.refreshUser();
      return 1;
    }
  }

  AutoLogout(){
    // No such thing; need interaction timings
    // Invoked when we want the user to be logged out;
    // At Destruction of App Component?
  }
  refreshUser(){
    if (this.currentUserDetail.password === 'absent') {
      this.currentUser.tokenExpirationDate = new Date(Date.now() + 3600 * 3 * 1000);
      return;
    }
    const refreshURL = 'https://securetoken.googleapis.com/v1/token?key=' + environment.apiKey;
    // tslint:disable-next-line: variable-name
    const refresh_token = this.currentUser.refresh_token;
    const payload = {
      grant_type : 'refresh_token',
      refresh_token
    };
    if (refresh_token != null) {
      this.http.post(refreshURL, payload).subscribe(
        (res: RefreshResponsePayload) => {
          this.currentUser.updateUser(res.refresh_token, res.expires_in, res.id_token);
        },
        err => {
          // console.log(err);
        }
      );
    }
  }
  errorHandler(error: any){
    this.router.navigate(['/', 'auth']);
    // console.log(error);
    return throwError(error);
  }
}
