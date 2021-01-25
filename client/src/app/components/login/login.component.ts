import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  login(): void {
    const values = this.form.value;
    this.authService.login(values.email, values.password)
      .subscribe(res => {
        console.log(res);
        if (res.message === 'success') {
          this.authService.setSession(res);
          this.router.navigateByUrl('/admin');
        }
        console.log(res);
        return this.form.reset();
      })
  }
}
