import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatSnackBarModule,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  dadosForm!: FormGroup;
  senhaForm!: FormGroup;

  novaSenhaVisivel = false;
  confirmarSenhaVisivel = false;
  activeTabIndex = 0;

  ngOnInit(): void {
    const usuario = this.authService.getUsuario();

    this.dadosForm = this.fb.group({
      nome: [usuario?.nome ?? '', [Validators.required]],
      email: [usuario?.email ?? '', [Validators.required, Validators.email]],
    });

    this.senhaForm = this.fb.group(
      {
        novaSenha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', [Validators.required]],
      },
      { validators: this.senhasIguaisValidator }
    );
  }

  private senhasIguaisValidator(group: AbstractControl): ValidationErrors | null {
    const novaSenha = group.get('novaSenha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;
    if (!novaSenha || !confirmarSenha) return null;
    return novaSenha === confirmarSenha ? null : { senhasNaoConferem: true };
  }

  toggleNovaSenha(): void {
    this.novaSenhaVisivel = !this.novaSenhaVisivel;
  }

  toggleConfirmarSenha(): void {
    this.confirmarSenhaVisivel = !this.confirmarSenhaVisivel;
  }

  confirmarAlteracoes(): void {
    if (this.activeTabIndex === 0) {
      this.salvarDados();
    } else {
      this.salvarSenha();
    }
  }

  private salvarDados(): void {
    if (this.dadosForm.invalid) {
      this.dadosForm.markAllAsTouched();
      return;
    }

    const dados = this.dadosForm.getRawValue();
    this.snackBar.open('Dados atualizados com sucesso!', 'OK', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
    console.log('Dados salvos:', dados);
  }

  private salvarSenha(): void {
    if (this.senhaForm.invalid) {
      this.senhaForm.markAllAsTouched();
      return;
    }

    const { novaSenha } = this.senhaForm.value;
    this.snackBar.open('Senha alterada com sucesso!', 'OK', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
    this.senhaForm.reset();
    console.log('Nova senha:', novaSenha);
  }

  refazerQuestionario(): void {
    this.router.navigate(['/questionario']);
  }
}
