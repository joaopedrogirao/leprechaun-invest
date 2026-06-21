import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  carregando = false;
  erroMensagem = '';
  enviado = false;

  enviar(): void {
    if (this.form.invalid) return;

    this.carregando = true;
    this.erroMensagem = '';

    const { email } = this.form.value;

    this.authService.solicitarRecuperacaoSenha(email.trim().toLowerCase()).subscribe({
      next: () => {
        this.carregando = false;
        this.enviado = true;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.carregando = false;
        this.erroMensagem = error.error?.erro ?? 'Erro ao enviar. Tente novamente mais tarde.';
        this.cdr.detectChanges();
      },
    });
  }
}