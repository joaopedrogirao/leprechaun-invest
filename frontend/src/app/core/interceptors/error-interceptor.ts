import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('usuario');

        const publicRoutes = ['/login', '/cadastro', '/esqueci-senha', '/redefinir-senha'];
        const isPublicRoute = publicRoutes.some(route => req.url.includes(route));

        if (!isPublicRoute) {
          router.navigate(['/login']);
        }
      }

      if (error.error) {
        if (typeof error.error === 'string') {
          try {
            error.error = JSON.parse(error.error);
          } catch {}
        }

        if (Array.isArray(error.error)) {
          const mensagens = error.error
            .map((e: { campo: string; mensagem: string }) => `${e.campo}: ${e.mensagem}`)
            .join('; ');
          error.mensagemErro = mensagens;
        }
        else if (error.error.erro) {
          error.mensagemErro = error.error.erro;
        }
      }

      return throwError(() => error);
    })
  );
};
