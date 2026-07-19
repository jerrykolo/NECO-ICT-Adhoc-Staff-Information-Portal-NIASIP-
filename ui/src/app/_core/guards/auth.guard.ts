import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn() || authService.isTokenExpired()) {
    authService.logout();
    router.navigate(['/login']);
    return false;
  }

  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  if (currentUser.firstLogin && state.url !== '/force-change-password') {
    router.navigate(['/force-change-password']);
    return false;
  }

  const url = state.url;
  if (url.startsWith('/admin') && currentUser.role !== 'ADMIN') {
    router.navigate(['/staff/dashboard']);
    return false;
  }

  if (url.startsWith('/staff') && currentUser.role !== 'STAFF' && currentUser.role !== 'ADMIN') {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
