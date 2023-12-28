import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { tap } from 'rxjs';

export const canMatch: CanMatchFn = () => {
  const router = inject(Router);
  return inject(UserService)
    .tokenValidation()
    .pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) router.navigateByUrl('/login');
      })
    );
};

export const AuthGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.tokenValidation().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigateByUrl('/login');
      }
    })
  );
};
