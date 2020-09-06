import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './auth-register.component.html'
})
export class AuthRegisterComponent implements OnInit{

  confirmPassword = new FormControl('', Validators.min(6));
  myRegForm: FormGroup;
  isLoading = false;
  constructor(
    private authService: AuthService,
    ){}
  ngOnInit(){
    this.myRegForm = new FormGroup({
      name: new FormControl('', Validators.required),
      roll_no: new FormControl(1, Validators.min(1)),
      email: new FormControl('', Validators.email),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      adminId: new FormControl(''),
    });
    // Group ID same as Admin ID of corresponding user
  }
  onSubmit(){
    if (this.myRegForm.get('password').value !== this.confirmPassword.value) {
      alert('Passwords don\'t match.');
      return;
    }
    this.isLoading = true;
    // console.log(this.myRegForm);
    const email = this.myRegForm.get('email').value;
    const password = this.myRegForm.get('password').value;
    const name = this.myRegForm.get('name').value;
    const adminId = this.myRegForm.get('adminId').value;
    const roll = this.myRegForm.get('roll_no').value;
    this.authService.Register(email, password, name, adminId, roll);
  }
}
