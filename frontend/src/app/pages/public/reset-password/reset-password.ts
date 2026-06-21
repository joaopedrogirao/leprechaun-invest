import { Component, inject, ChangeDetectorRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  form: FormGroup = this.fb.group({
    token: ['', [Validators.required]],
    novaSenha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required]],
  });

  senhaVisivel = false;
  confirmarSenhaVisivel = false;
  carregando = false;
  erroMensagem = '';
  sucesso = false;

  constructor() {
    this.form.get('confirmarSenha')?.addValidators(
      this.confirmarSenhaValidator.bind(this)
    );

    this.form.get('novaSenha')?.valueChanges.subscribe(() => {
      this.form.get('confirmarSenha')?.updateValueAndValidity();
    });
  }

  private confirmarSenhaValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value !== this.form?.get('novaSenha')?.value) {
      return { senhaNaoConfere: true };
    }
    return null;
  }

  toggleSenha(): void {
    this.senhaVisivel = !this.senhaVisivel;
  }

  toggleConfirmarSenha(): void {
    this.confirmarSenhaVisivel = !this.confirmarSenhaVisivel;
  }

  redefinir(): void {
    if (this.form.invalid) return;

    this.carregando = true;
    this.erroMensagem = '';

    const { token, novaSenha } = this.form.value;

    this.authService.redefinirSenha(token.trim(), novaSenha).subscribe({
      next: () => {
        this.carregando = false;
        this.sucesso = true;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.carregando = false;
        this.erroMensagem =
          error.error?.erro ?? 'Erro ao redefinir senha. Tente novamente.';
        this.cdr.detectChanges();
      },
    });
  }
}
