import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Observable} from "rxjs";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
  }

}
