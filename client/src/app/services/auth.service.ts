import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from "rxjs";
import {HttpClient} from "@angular/common/http";
import * as moment from 'moment';
import {map, shareReplay, tap} from "rxjs/operators";
import {Router} from "@angular/router";

const APIURL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoginSubject$ = new BehaviorSubject<boolean>(this.getToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private getToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getExpiration(): boolean {
    const expiration = localStorage.getItem('expiresIn');
    return JSON.parse(expiration) > Date.now();
  }

  public setSession(authResults): void {
    const expiresIn = moment().add(authResults.expiresIn, 'second');
    localStorage.setItem('token', authResults.data);
    localStorage.setItem('expiresIn', JSON.stringify(expiresIn.valueOf()))
    this.isLoggedIn();
  }

  public isLoggedIn(): Observable<any> {
    if (this.getExpiration()) {
      this.isLoginSubject$.next(true);
      console.log('our token is valid')
    } else {
      this.isLoginSubject$.next(false);
      console.log('our token has expired')
    }
    return this.isLoginSubject$.asObservable();
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    this.isLoginSubject$.next(false);
  }

  public login(email: string, password: string): Observable<any> {
    return this.http.post<any>(APIURL + '/login', { email, password })
      .pipe(
        shareReplay()
      //  this will prevent subscribers from executing this multiple times and instead the just "replay" the value
      )
  }

  public signup(data): Observable<any> {
    return this.http.post<any>(APIURL + '/signup', { data })
      .pipe(
        shareReplay()
      )
  }

  public getUsers(): Observable<any> {
    return this.http.get<any>(APIURL + '/users')
      .pipe(
        shareReplay(),
        map(res => {
          if (res.message === 'success') {
            return res.data;
          }
          // if error message
          return res;
        })
      );
  }

  public admin(): Observable<any> {
    return this.http.get<any>(APIURL + '/admin');
  }

  public deleteUsers(data): void {
    let url = '';
    // build query string from id's to be deleted
    data.forEach(id => {
      url += `id=${id._id}&`;
    })
    this.http.delete(APIURL + '/delete?' + url)
      .subscribe(response => {
        console.log(response);
        // if (response.message === 'error') {
        //   alert(response.data);
        //   return location.reload(true);
        // }
      });
  }




}
