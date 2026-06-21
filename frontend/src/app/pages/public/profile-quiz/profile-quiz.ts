import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth';
import { QuizPerfilService } from '../../../core/services/quiz-perfil.service';
import { PERGUNTAS_QUIZ } from '../../../core/models/quiz-perfil.model';

@Component({
  selector: 'app-profile-quiz',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule,
    MatRadioModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile-quiz.html',
  styleUrl: './profile-quiz.scss',
})
export class ProfileQuiz implements OnInit {
  private authService = inject(AuthService);
  private quizPerfilService = inject(QuizPerfilService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected readonly perguntas = PERGUNTAS_QUIZ;

  passoAtual = signal(1);
  respostasSelecionadas = signal<number[]>([]);
  exibirQuiz = signal(true);
  enviando = signal(false);
  erro = signal<string | null>(null);
  perfilResultado = signal<string | null>(null);

  progresso = computed(() =>
    Math.round((this.passoAtual() / this.perguntas.length) * 100)
  );

  perguntaAtual = computed(() => this.perguntas[this.passoAtual() - 1]);

  modoRefazer = signal(false);

  ngOnInit() {
    const usuario = this.authService.getUsuario();

    if (!usuario?.id) {
      this.router.navigate(['/login']);
      return;
    }

    const refazer = this.route.snapshot.queryParamMap.get('refazer') === 'true';
    this.modoRefazer.set(refazer);

    if (usuario.perfilInvestidor && !refazer) {
      this.perfilResultado.set(usuario.perfilInvestidor);
      this.exibirQuiz.set(false);
    }
  }

  refazerQuiz() {
    this.modoRefazer.set(true);
    this.passoAtual.set(1);
    this.respostasSelecionadas.set([]);
    this.erro.set(null);
    this.perfilResultado.set(null);
    this.exibirQuiz.set(true);
  }

  proximoPasso(pontosDaOpcao: number) {
    if (this.enviando()) return;

    const novasRespostas = [...this.respostasSelecionadas(), pontosDaOpcao];
    this.respostasSelecionadas.set(novasRespostas);

    if (this.passoAtual() < this.perguntas.length) {
      this.passoAtual.set(this.passoAtual() + 1);
    } else {
      this.enviarRespostas(novasRespostas);
    }
  }

  voltarPasso() {
    if (this.passoAtual() > 1) {
      const respostasAtuais = [...this.respostasSelecionadas()];
      respostasAtuais.pop();
      this.respostasSelecionadas.set(respostasAtuais);
      this.passoAtual.set(this.passoAtual() - 1);
      this.erro.set(null);
    }
  }

  irParaDashboard() {
    this.router.navigate(['/app/dashboard']);
  }

  private getPerfilLabel(perfil: string): string {
    const labels: Record<string, string> = {
      CONSERVADOR: 'Conservador',
      MODERADO: 'Moderado',
      ARROJADO: 'Arrojado',
    };
    return labels[perfil?.toUpperCase()] ?? perfil;
  }

  private getPerfilIcon(perfil: string): string {
    const icons: Record<string, string> = {
      CONSERVADOR: 'shield',
      MODERADO: 'balance',
      ARROJADO: 'rocket_launch',
    };
    return icons[perfil?.toUpperCase()] ?? 'person';
  }

  protected get perfilLabel(): string {
    return this.getPerfilLabel(this.perfilResultado() ?? '');
  }

  protected get perfilIcon(): string {
    return this.getPerfilIcon(this.perfilResultado() ?? '');
  }

  private enviarRespostas(respostas: number[]) {
    this.enviando.set(true);
    this.erro.set(null);

    const requisicao$ = this.modoRefazer()
    ? this.quizPerfilService.refazerPerfilInvestidor({ respostas })
    : this.quizPerfilService.definirPerfilInvestidor({ respostas });

    requisicao$.subscribe({
      next: (usuarioAtualizado) => {
        this.enviando.set(false);
        this.authService.salvarUsuario(usuarioAtualizado);
        this.perfilResultado.set(usuarioAtualizado.perfilInvestidor);
        this.exibirQuiz.set(false);
      },
      error: (err) => {
      this.enviando.set(false);
      this.erro.set('Não foi possível salvar seu perfil. Tente novamente.');
      console.error('Erro ao definir perfil investidor', err);

      this.passoAtual.set(this.perguntas.length);
      this.respostasSelecionadas.set(respostas.slice(0, -1));
      },
      });
    }
  }