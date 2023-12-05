import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment.development';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private hppt: HttpClient) {}

  createUser(formData: RegisterForm) {
    return this.hppt.post(`${base_url}/users`, formData);
  }
}
