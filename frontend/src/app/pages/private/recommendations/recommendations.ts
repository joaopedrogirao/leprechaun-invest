import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth';
import { InvestmentService, InvestimentoDTO } from '../../../core/services/investment';

interface PerfilConfig {
  nome: string;
  descricao: string;
  icone: string;
  nivelRisco: string;
}

interface RecomendacaoCard {
  investimento: InvestimentoDTO;
  destaque: string;
  destaqueValor: string;
  idealPara: string;
}

interface ResumoCategoria {
  nome: string;
  percentual: number;
  descricao: string;
  cor: string;
}

@Component({
  selector: 'app-recommendations',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './recommendations.html',
  styleUrl: './recommendations.scss',
})
export class Recommendations implements OnInit {
  private authService = inject(AuthService);
  private investmentService = inject(InvestmentService);
  private router = inject(Router);

  carregando = signal(true);
  erro = signal('');
  perfil = signal('MODERADO');

  perfilConfig = computed<PerfilConfig>(() => {
    const configs: Record<string, PerfilConfig> = {
      CONSERVADOR: {
        nome: 'Perfil Conservador',
        descricao: 'Prioriza segurança e estabilidade. Prefere investimentos de baixo risco.',
        icone: 'shield',
        nivelRisco: 'Baixo',
      },
      MODERADO: {
        nome: 'Perfil Moderado',
        descricao: 'Equilíbrio entre risco e retorno. Busca crescimento com segurança.',
        icone: 'balance',
        nivelRisco: 'Médio',
      },
      ARROJADO: {
        nome: 'Perfil Arrojado',
        descricao: 'Aceita maior risco para buscar maiores retornos. Foco no longo prazo.',
        icone: 'rocket_launch',
        nivelRisco: 'Alto',
      },
    };
    return configs[this.perfil()] ?? configs['MODERADO'];
  });

  todosInvestimentos = signal<InvestimentoDTO[]>([]);

  recomendacoes = computed<RecomendacaoCard[]>(() => {
    const perfil = this.perfil();
    const todos = this.todosInvestimentos();

    const filtrados = this.filtrarPorPerfil(todos, perfil);

    return filtrados.map(inv => ({
      investimento: inv,
      destaque: this.getDestaque(inv),
      destaqueValor: this.getDestaqueValor(inv),
      idealPara: this.getIdealPara(inv),
    }));
  });

  resumoCategorias = computed<ResumoCategoria[]>(() => {
    const recs = this.recomendacoes();
    if (!recs.length) return [];

    const contagem: Record<string, number> = {};
    recs.forEach(r => {
      const tipo = this.formatarTipoCategoria(r.investimento.tipo);
      contagem[tipo] = (contagem[tipo] || 0) + 1;
    });

    const total = recs.length;
    const cores = ['#2f7d43', '#1a6bb5', '#9a6a00', '#8b5cf6', '#dc2626', '#0891b2'];
    let i = 0;

    return Object.entries(contagem).map(([nome, qtd]) => ({
      nome,
      percentual: Math.round((qtd / total) * 100),
      descricao: this.getDescricaoCategoria(nome),
      cor: cores[i++ % cores.length],
    }));
  });

  ngOnInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    const usuario = this.authService.getUsuario();
    const perfilUsuario = usuario?.perfilInvestidor ?? usuario?.perfil ?? 'MODERADO';
    this.perfil.set(perfilUsuario.toUpperCase());

    this.investmentService.listarTodos().subscribe({
      next: (investimentos) => {
        this.todosInvestimentos.set(investimentos);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar investimentos:', err);
        this.erro.set('Não foi possível carregar as recomendações.');
        this.carregando.set(false);
      },
    });
  }

  private filtrarPorPerfil(investimentos: InvestimentoDTO[], perfil: string): InvestimentoDTO[] {
    if (perfil === 'CONSERVADOR') {
      return investimentos.filter(inv =>
        inv.perfilRecomendado === 'CONSERVADOR' || inv.nivelRisco === 'BAIXO'
      );
    }

    if (perfil === 'ARROJADO') {
      return investimentos.filter(inv =>
        inv.perfilRecomendado === 'ARROJADO' || inv.nivelRisco === 'ALTO'
      );
    }

    return investimentos.filter(inv =>
      inv.perfilRecomendado === 'MODERADO' ||
      inv.perfilRecomendado === 'CONSERVADOR' ||
      inv.nivelRisco === 'BAIXO' ||
      inv.nivelRisco === 'MEDIO'
    );
  }

  private getDestaque(inv: InvestimentoDTO): string {
    switch (inv.tipo) {
      case 'TESOURO': return 'Rentabilidade estimada';
      case 'CDB': return 'Rentabilidade estimada';
      case 'LCI_LCA': return 'Rentabilidade estimada';
      case 'FII': return 'Dividendos mensais';
      case 'ACAO': return 'Potencial de valorização';
      case 'ETF': return 'Diversificação automática';
      default: return 'Investimento';
    }
  }

  private getDestaqueValor(inv: InvestimentoDTO): string {
    if (inv.indexador === 'SELIC') return 'Taxa Selic';
    if (inv.indexador === 'CDI') return '100% do CDI';
    if (inv.indexador === 'IPCA') return 'IPCA + juros';
    if (inv.indexador === 'PREFIXADO') return 'Taxa prefixada';
    if (inv.indexador === 'VARIAVEL') return 'Variável';
    return inv.nome;
  }

  private getIdealPara(inv: InvestimentoDTO): string {
    switch (inv.objetivoRecomendado) {
      case 'RESERVA_EMERGENCIA': return 'Reserva e segurança';
      case 'CURTO_PRAZO': return 'Curto prazo';
      case 'MEDIO_PRAZO': return 'Médio prazo';
      case 'LONGO_PRAZO': return 'Longo prazo';
      case 'RENDA_MENSAL': return 'Renda passiva';
      case 'CRESCIMENTO_PATRIMONIAL': return 'Crescimento patrimonial';
      default: return 'Diversificação';
    }
  }

  formatarTipo(tipo: string): string {
    const mapa: Record<string, string> = {
      TESOURO: 'Tesouro Direto',
      CDB: 'CDB Bancário',
      LCI_LCA: 'LCI / LCA',
      FII: 'Fundos Imobiliários',
      ACAO: 'Ações',
      ETF: 'ETF',
    };
    return mapa[tipo] ?? tipo;
  }

  formatarRisco(risco: string): string {
    const mapa: Record<string, string> = {
      BAIXO: 'Baixo',
      MEDIO: 'Médio',
      ALTO: 'Alto',
    };
    return mapa[risco] ?? risco;
  }

  formatarHorizonte(horizonte: string): string {
    const mapa: Record<string, string> = {
      CURTO: 'Curto prazo',
      MEDIO: 'Médio prazo',
      LONGO: 'Longo prazo',
    };
    return mapa[horizonte] ?? horizonte;
  }

  formatarLiquidez(liquidez: string): string {
    const mapa: Record<string, string> = {
      ALTA: 'Alta',
      MEDIA: 'Média',
      BAIXA: 'Baixa',
    };
    return mapa[liquidez] ?? liquidez;
  }

  getIconePorTipo(tipo: string): string {
    const mapa: Record<string, string> = {
      TESOURO: 'account_balance',
      CDB: 'savings',
      LCI_LCA: 'home_work',
      FII: 'apartment',
      ACAO: 'trending_up',
      ETF: 'pie_chart',
    };
    return mapa[tipo] ?? 'attach_money';
  }

  getCorRisco(risco: string): string {
    switch (risco) {
      case 'BAIXO': return '#2f7d43';
      case 'MEDIO': return '#c87b00';
      case 'ALTO': return '#c62828';
      default: return '#607064';
    }
  }

  getBgRisco(risco: string): string {
    switch (risco) {
      case 'BAIXO': return '#e6f4e9';
      case 'MEDIO': return '#fff3d8';
      case 'ALTO': return '#fdecec';
      default: return '#f5f8f4';
    }
  }

  private formatarTipoCategoria(tipo: string): string {
    const mapa: Record<string, string> = {
      TESOURO: 'Renda Fixa',
      CDB: 'Renda Fixa',
      LCI_LCA: 'Renda Fixa',
      FII: 'Imobiliário',
      ACAO: 'Renda Variável',
      ETF: 'Renda Variável',
    };
    return mapa[tipo] ?? 'Outros';
  }

  private getDescricaoCategoria(nome: string): string {
    const mapa: Record<string, string> = {
      'Renda Fixa': 'Mais segurança e estabilidade.',
      'Renda Variável': 'Potencial de crescimento.',
      'Imobiliário': 'Renda passiva e diversificação.',
    };
    return mapa[nome] ?? '';
  }

  verDetalhes(inv: InvestimentoDTO): void {
    this.router.navigate(['/app/simulacoes/nova']);
  }

  irParaSimulacoes(): void {
    this.router.navigate(['/app/simulacoes']);
  }
}
