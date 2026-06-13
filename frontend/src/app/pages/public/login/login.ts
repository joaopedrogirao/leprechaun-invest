import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]],
  });

  senhaVisivel = false;
  carregando = false;
  erroMensagem = '';

  toggleSenha(): void {
    this.senhaVisivel = !this.senhaVisivel;
  }

  entrar(): void {
    if (this.form.invalid) return;

    this.carregando = true;
    this.erroMensagem = '';

    const { email, senha } = this.form.value;

    this.authService.login(email, senha).pipe(
      switchMap(() => this.authService.buscarUsuarioLogado())
    ).subscribe({
      next: (usuario) => {
        this.carregando = false;
        this.authService.salvarUsuario(usuario);

        if (this.authService.getPrimeiroAcesso()) {
          this.router.navigate(['/questionario']);
        } else {
          this.router.navigate(['/app/dashboard']);
        }
      },
      error: (error) => {
        this.carregando = false;

        const mensagens: Record<number, string> = {
          401: 'E-mail ou senha incorretos.',
          403: 'Acesso negado.',
          500: 'Erro no servidor. Tente novamente mais tarde.',
        };

        this.erroMensagem =
          mensagens[error.status] ?? 'Erro ao entrar. Tente novamente.';
      },
    });
  }
}
