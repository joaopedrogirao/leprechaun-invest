import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
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
  form: FormGroup;
  senhaVisivel = false;
  confirmarSenhaVisivel = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
    });

    // Validação cruzada: confirmar senha deve ser igual à senha
    this.form.get('confirmarSenha')?.addValidators(this.confirmarSenhaValidator.bind(this));
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
    if (this.form.valid) {
      const { nome, email, telefone, senha } = this.form.value;
      console.log('Cadastro:', nome, email, telefone, senha);
      this.router.navigate(['/login']);
    }
  }
}
