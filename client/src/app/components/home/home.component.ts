import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  users$: Observable<any>;
  displayedColumns: string[] = ['email', 'firstName', 'lastName'];

  constructor(
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {

    }

  ngOnInit(): void {
    this.users$ = this.authService.getUsers();
  }


}
