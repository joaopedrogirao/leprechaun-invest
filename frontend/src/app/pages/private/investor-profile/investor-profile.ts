import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

interface PerfilInfo {
  tipo: string;
  descricao: string;
  caracteristicas: string[];
  icone: string;
}

interface InfoPessoal {
  icone: string;
  label: string;
  valor: string;
}

@Component({
  selector: 'app-investor-profile',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: './investor-profile.html',
  styleUrl: './investor-profile.scss',
})
export class InvestorProfile implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario = signal<any>(null);

  perfilInfo = signal<PerfilInfo>({
    tipo: '',
    descricao: '',
    caracteristicas: [],
    icone: 'account_circle',
  });

  informacoesPessoais = signal<InfoPessoal[]>([]);

  ngOnInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    this.authService.buscarUsuarioLogado().subscribe({
      next: (usuario) => {
        this.authService.salvarUsuario(usuario);
        this.preencherDados(usuario);
      },
      error: () => {
        const usuarioLocal = this.authService.getUsuario();
        this.preencherDados(usuarioLocal);
      },
    });
  }

  private preencherDados(usuario: any): void {
    this.usuario.set(usuario);

    const perfil = usuario?.perfilInvestidor ?? usuario?.perfil ?? 'MODERADO';
    this.configurarPerfil(perfil);
    this.configurarInfoPessoais(usuario);
  }

  private configurarPerfil(perfil: string): void {
    const perfis: Record<string, PerfilInfo> = {
      CONSERVADOR: {
        tipo: 'Conservador',
        descricao: 'Prioriza segurança e estabilidade. Prefere investimentos de baixo risco.',
        caracteristicas: ['Segurança', 'Estabilidade', 'Renda fixa', 'Baixo risco'],
        icone: 'shield',
      },
      MODERADO: {
        tipo: 'Moderado',
        descricao: 'Equilíbrio entre risco e retorno. Busca crescimento com segurança.',
        caracteristicas: ['Equilíbrio', 'Planejamento', 'Diversificação', 'Médio prazo'],
        icone: 'balance',
      },
      ARROJADO: {
        tipo: 'Arrojado',
        descricao: 'Aceita maior risco para buscar maiores retornos. Foco no longo prazo.',
        caracteristicas: ['Alto retorno', 'Renda variável', 'Longo prazo', 'Crescimento'],
        icone: 'rocket_launch',
      },
    };

    const key = perfil.toUpperCase();
    this.perfilInfo.set(perfis[key] ?? perfis['MODERADO']);
  }

  private configurarInfoPessoais(usuario: any): void {
    this.informacoesPessoais.set([
      { icone: 'person', label: 'Nome completo', valor: usuario?.nome ?? 'Não informado' },
      { icone: 'email', label: 'E-mail', valor: usuario?.email ?? 'Não informado' },
      { icone: 'badge', label: 'Perfil', valor: this.perfilInfo().tipo },
    ]);
  }

  editarPerfil(): void {
    this.router.navigate(['/app/configuracoes']);
  }

  refazerQuestionario(): void {
    this.router.navigate(['/questionario'], { queryParams: { refazer: 'true' } });
  }
}