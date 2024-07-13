import { Injectable, afterNextRender } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { LocalStorageService } from '../../../core/browser/services/local-storage.service';
import { IUser } from '../interfaces/IUser';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {}

  private baseUrl = environment.apiUrl;

  private loggedIn = new BehaviorSubject<boolean>(this.isTokenValid());

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/auth/login`, credentials)
      .pipe(tap((response: any) => this.handleAuthentication(response.token)));
  }

  signup(user: IUser): Observable<IUser> {
    console.log('user', user);
    return this.http.post<IUser>(`${this.baseUrl}/auth/register`, user);
  }

  logout(): void {
    this.localStorageService.remove('token');
    this.localStorageService.remove('name');
    this.localStorageService.remove('email');
    this.localStorageService.remove('id');
    this.localStorageService.remove('userType');
    this.loggedIn.next(false);

    this.router.navigate(['']);
  }

  handleAuthentication(token: string): void {
    try {
      this.localStorageService.set('token', token);
      const decodedToken: { [key: string]: any } = this.decodeToken();
      const id =
        decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ];

      const email =
        decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ];

      this.localStorageService.set('id', id);
      this.localStorageService.set('email', email);

      this.loggedIn.next(true);
    } catch (error) {
      console.error(error);
    }
  }

  decodeToken(): any {
    const token = localStorage.getItem('token');
    const response = token ? jwtDecode(token) : null;
    return response;
  }

  isTokenValid(): boolean {
    const token = this.localStorageService.get('token');
    if (!token) {
      return false;
    }

    const decodedToken = this.decodeToken();
    if (!decodedToken) {
      return false;
    }

    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decodedToken.exp);

    return expirationDate > new Date();
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
}
