import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public formSubnitted = false;

  public loginForm: FormGroup = this.fb.group({
    email: ['johndoe@email.com', [Validators.required, Validators.email]],
    password: ['12345678', Validators.required],
    remember: [false],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  login() {
    this.userService.login(this.loginForm.value).subscribe({
      next: (resp) => {
        console.log(resp);
      },
      error: (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      },
      complete: () => console.log('Complete'),
    });
  }
}
