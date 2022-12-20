import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {LoginResponseType} from "../../../types/login-response.type";
import {Observable, Subject, tap} from "rxjs";
import {UserInfoType} from "../../../types/user-info.type";
import {LogoutResponseType} from "../../../types/logout-response.type";
import {SignupResponseType} from "../../../types/signup-response.type";
import {RefreshResponseType} from "../../../types/refresh-response.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLogged$: Subject<boolean> = new Subject<boolean>()
  public accessTokenKey: string = 'accessToken';
  private refreshTokenKey: string = 'refreshToken';
  userInfo: string = 'userInfo';
  private isLogged = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  public login(email: string, password: string): Observable<LoginResponseType> {
    return this.http.post<LoginResponseType>(environment.apiHost + 'login', {
      email,
      password,
    })
      .pipe(
        tap((data: LoginResponseType)=> {
          if(data.fullName && data.userId && data.accessToken && data.refreshToken) {
            this.setUserInfo({
              fullName: data.fullName,
              userId: data.userId,
              email: email
            })
            this.setTokens(data.accessToken, data.refreshToken);
          }
        })
      )
  }

  public signup(email: string, password: string, name: string, lastName: string): Observable<SignupResponseType> {
    return this.http.post<SignupResponseType>(environment.apiHost + 'signup', {
      name,
      lastName,
      email,
      password,
    })
  }

  public logout(): Observable<LogoutResponseType> {
    const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
    return this.http.post<LogoutResponseType>(environment.apiHost + 'logout', {refreshToken})
  }

  public refresh(): Observable<RefreshResponseType> {
    const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey)
    return this.http.post<RefreshResponseType>(environment.apiHost + 'refresh', {refreshToken})
  }


  public getLoggedIn(): boolean {
    return this.isLogged;
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  public getTokens(): {accessToken: string | null, refreshToken: string | null} {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)    }
  }

  public removeUserInfo(): void {
    localStorage.removeItem(this.userInfo);
  }

  public setUserInfo(info: UserInfoType): void {
    localStorage.setItem(this.userInfo, JSON.stringify(info));
  }
  public getUserInfo(): UserInfoType | null {
    const userInfo: string | null = localStorage.getItem(this.userInfo);
    if(userInfo) {
      return JSON.parse(userInfo);
    }
    return null;
  }
}
