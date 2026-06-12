import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { catchError, map, of, tap } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.buscarUsuarioLogado().pipe(
    tap(usuario => auth.salvarUsuario(usuario)),
    map(() => true),
    catchError(() => {
      auth.limparSessaoLocal();
      return of(router.createUrlTree(['/login']));
    }),
  );
};
