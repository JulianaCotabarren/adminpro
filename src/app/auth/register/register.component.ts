import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControlOptions,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public formSubmitted = false;

  public registerForm = this.fb.group(
    {
      name: ['John', Validators.required],
      email: ['johndoe@email.com', [Validators.required, Validators.email]],
      password: ['12345678', Validators.required],
      password2: ['12345678', Validators.required],
      terms: [true, Validators.required],
    },
    {
      validators: this.equalPasswords(
        'password',
        'password2'
      ) as FormControlOptions,
    }
  );

  constructor(private fb: FormBuilder, private userService: UserService) {}

  createUser() {
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
      return;
    }

    this.userService.createUser(this.registerForm.value).subscribe({
      next: (resp) => {
        console.log('user created');
        console.log(resp);
      },
      error: (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      },
      complete: () => console.log('User created'),
    });
  }

  invalidField(field: string): boolean {
    if (this.registerForm.get(field)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  invalidPasswords() {
    const password = this.registerForm.get('password')?.value;
    const password2 = this.registerForm.get('password2')?.value;

    if (password !== password2 && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  equalPasswords(password: string, password2: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.get(password);
      const password2Control = formGroup.get(password2);

      if (passwordControl?.value === password2Control?.value) {
        password2Control?.setErrors(null);
      } else {
        password2Control?.setErrors({ isNotEqual: true });
      }
    };
  }

  termsAccepted() {
    return !this.registerForm.get('terms')?.value && this.formSubmitted;
  }
}
