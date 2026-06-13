import { Component, inject } from '@angular/core';
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
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  private authService = inject(AuthService);
  private fb          = inject(FormBuilder);
  private router      = inject(Router);

  senhaVisivel         = false;
  confirmarSenhaVisivel = false;
  carregando           = false;
  erroMensagem         = '';

  form: FormGroup = this.fb.group(
    {
      nome:           ['', [Validators.required, Validators.minLength(3)]],
      email:          ['', [Validators.required, Validators.email]],
      senha:          ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
    }
  );

  constructor() {
    this.form.get('confirmarSenha')?.addValidators(
      this.confirmarSenhaValidator.bind(this)
    );

    this.form.get('senha')?.valueChanges.subscribe(() => {
      this.form.get('confirmarSenha')?.updateValueAndValidity();
    });
  }

  private confirmarSenhaValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value !== this.form?.get('senha')?.value) {
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

  cadastrar(): void {
    if (this.form.invalid) return;

    this.carregando  = true;
    this.erroMensagem = '';

    const { nome, email, senha } = this.form.value;

    this.authService.register({
      nome:  nome.trim(),
      email: email.trim().toLowerCase(),
      senha,
    }).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.carregando = false;

        const mensagens: Record<number, string> = {
          409: 'Este e-mail já está cadastrado.',
          400: 'Dados inválidos. Verifique os campos.',
          500: 'Erro no servidor. Tente novamente mais tarde.',
        };

        this.erroMensagem =
          mensagens[error.status] ?? 'Erro ao cadastrar. Tente novamente.';
      },
    });
  }
}