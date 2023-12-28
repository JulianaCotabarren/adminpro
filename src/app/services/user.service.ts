import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment.development';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { LoadUser } from '../interfaces/load-users.interface';

declare const google: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.user.uid || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.user.role;
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  saveLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  logout() {
    const email = localStorage.getItem('email') || '';

    google.accounts.id.revoke(email, () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('menu');
    });
  }

  tokenValidation(): Observable<boolean> {
    google.accounts.id.initialize({
      client_id:
        '965765021068-hfv0g89k5obnpose7pi0dq4dii81rbi7.apps.googleusercontent.com',
    });

    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          const { email, google, name, role, img = '', uid } = resp.user;
          this.user = new User(name, email, '', img, google, role, uid);
          this.saveLocalStorage(resp.token, resp.menu);
          return true;
        }),
        catchError((error) => of(false))
      );
  }

  createUser(formData: RegisterForm) {
    return this.http.post(`${base_url}/users`, formData).pipe(
      tap((resp: any) => {
        this.saveLocalStorage(resp.token, resp.menu);
      })
    );
  }

  updateProfile(data: { email: string; name: string; role: string }) {
    data = {
      ...data,
      role: this.user.role,
    };
    return this.http.put(`${base_url}/users/${this.uid}`, data, this.headers);
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        this.saveLocalStorage(resp.token, resp.menu);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        localStorage.setItem('email', resp.email);
        this.saveLocalStorage(resp.token, resp.menu);
      })
    );
  }

  loadUsers(from: number = 0) {
    const url = `${base_url}/users?from=${from}`;
    return this.http.get<LoadUser>(url, this.headers).pipe(
      map((resp) => {
        const users = resp.users.map(
          (user) =>
            new User(
              user.name,
              user.email,
              '',
              user.img,
              user.google,
              user.role,
              user.uid
            )
        );
        return {
          total: resp.total,
          users,
        };
      })
    );
  }

  deleteUser(user: User) {
    const url = `${base_url}/users/${user.uid}`;
    return this.http.delete(url, this.headers);
  }

  saveUser(user: User) {
    return this.http.put(`${base_url}/users/${user.uid}`, user, this.headers);
  }
}
