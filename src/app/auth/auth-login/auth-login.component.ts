import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './auth-login.component.html'
})
export class AuthLoginComponent implements OnInit{
  email = '';
  password = '';
  myLoginForm: FormGroup;
  isLoading = false;
  constructor(private router: Router, private authService: AuthService){}
  ngOnInit(){
    this.myLoginForm = new FormGroup({
      email: new FormControl('', [, Validators.email, Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }
  onSubmit(){
    this.isLoading = true;
    const email = this.myLoginForm.get('email').value;
    const password = this.myLoginForm.get('password').value;
    this.authService.Login(email, password);
  }
}
