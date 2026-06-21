import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatProgressSpinnerModule,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  dadosForm!: FormGroup;
  salvando = false;

  private emailOriginal = '';

  ngOnInit(): void {
    const usuario = this.authService.getUsuario();
    this.emailOriginal = usuario?.email ?? '';

    this.dadosForm = this.fb.group({
      nome: [usuario?.nome ?? '', [Validators.required]],
      email: [usuario?.email ?? '', [Validators.required, Validators.email]],
    });
  }

  salvarDados(): void {
    if (this.dadosForm.invalid) {
      this.dadosForm.markAllAsTouched();
      return;
    }

    this.salvando = true;
    const dados = this.dadosForm.getRawValue();

    const emailMudou =
      dados.email?.trim().toLowerCase() !== this.emailOriginal.trim().toLowerCase();

    this.authService.atualizarCadastro(dados).subscribe({
      next: () => {
        this.salvando = false;
        this.cdr.markForCheck();

        if (emailMudou) {
          this.snackBar.open(
            'Dados atualizados! Faça login novamente para continuar.',
            'OK',
            {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            }
          );
          this.authService.logout();
        } else {
          this.snackBar.open('Dados atualizados com sucesso!', 'OK', {
            duration: 4000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.emailOriginal = dados.email;
        }
      },
      error: (err) => {
        this.salvando = false;
        this.cdr.markForCheck();

        const mensagem =
          err.error?.mensagem || err.error?.message || 'Erro ao atualizar dados.';
        this.snackBar.open(mensagem, 'Fechar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
    });
  }

  irParaRecuperarSenha(): void {
    this.router.navigate(['/esqueci-senha']);
  }

  refazerQuestionario(): void {
    this.router.navigate(['/questionario'], { queryParams: { refazer: 'true' } });
  }
}