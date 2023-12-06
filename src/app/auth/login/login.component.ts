import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted = false;

  public loginForm: FormGroup = this.fb.group({
    email: [
      localStorage.getItem('email' || ''),
      [Validators.required, Validators.email],
    ],
    password: ['', Validators.required],
    remember: [false],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id:
        '965765021068-hfv0g89k5obnpose7pi0dq4dii81rbi7.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
    });
    google.accounts.id.renderButton(this.googleBtn.nativeElement, {
      theme: 'outline',
      size: 'large',
    });
  }

  handleCredentialResponse(response: any) {
    //console.log('Encoded JWT ID token: ' + response.credential);
    this.userService.loginGoogle(response.credential).subscribe({
      next: (resp) => {
        //console.log({ login: resp });
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      },
      complete: () => console.log('LoginGoogle complete'),
    });
  }

  login() {
    this.userService.login(this.loginForm.value).subscribe({
      next: (resp) => {
        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem('email', this.loginForm.get('email')?.value);
        } else {
          localStorage.removeItem('email');
        }
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      },
      complete: () => console.log('Login complete'),
    });
  }
}
