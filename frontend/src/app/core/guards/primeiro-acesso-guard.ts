import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const primeiroAcessoGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getPrimeiroAcesso()) {
    router.navigate(['/questionario']);
    return false;
  }

  return true;
};