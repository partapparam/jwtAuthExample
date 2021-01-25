import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  signup(): void {
    const values = this.signupForm.value;
    this.authService.signup(values)
      .subscribe(res => {
        console.log(res);
        if (res.message === 'success') {
          this.authService.setSession(res);
          return this.router.navigateByUrl('/admin');
        }
        // if request failed
        console.log(res.data);
        return this.signupForm.reset();
      })
  }
}
