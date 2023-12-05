import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment.development';
import { LoginForm } from '../interfaces/login-form.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private hppt: HttpClient) {}

  createUser(formData: RegisterForm) {
    return this.hppt.post(`${base_url}/users`, formData);
  }

  login(formData: LoginForm) {
    return this.hppt.post(`${base_url}/login`, formData);
  }
}
