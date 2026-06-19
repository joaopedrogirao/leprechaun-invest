import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { Simulation } from '../../../../core/services/simulation';
import { SimulacaoDetalhes } from '../../../../core/models/simulation.model';

@Component({
  selector: 'app-simulation-details',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './simulation-details.html',
  styleUrl: './simulation-details.scss',
})
export class SimulationDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private simulacaoService = inject(Simulation);

  detalhes = signal<SimulacaoDetalhes | null>(null);
  carregando = signal(true);
  erro = signal('');

  rentabilidadePercentual = computed(() => {
    const dados = this.detalhes();

    if (!dados || dados.resumo.totalInvestido === 0) {
      return 0;
    }

    return (dados.resumo.totalRendimento / dados.resumo.totalInvestido) * 100;
  });

  lineChartType: 'line' = 'line';
  pieChartType: 'pie' = 'pie';
  barChartType: 'bar' = 'bar';

  lineChartData = signal<ChartConfiguration<'line'>['data']>({
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Saldo projetado',
        tension: 0.35,
        fill: false,
      },
      {
        data: [],
        label: 'Total investido',
        tension: 0.35,
        fill: false,
      },
    ],
  });

  pieChartData = signal<ChartConfiguration<'pie'>['data']>({
    labels: ['Total investido', 'Rendimento'],
    datasets: [
      {
        data: [],
      },
    ],
  });

  barChartData = signal<ChartConfiguration<'bar'>['data']>({
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Rendimento mensal',
      },
    ],
  });

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${this.formatarMoeda(Number(context.raw))}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => this.formatarMoeda(Number(value)),
        },
      },
    },
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${this.formatarMoeda(Number(context.raw))}`;
          },
        },
      },
    },
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${this.formatarMoeda(Number(context.raw))}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => this.formatarMoeda(Number(value)),
        },
      },
    },
  };

  ngOnInit(): void {
    this.carregarDetalhes();
  }

  carregarDetalhes(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.erro.set('Simulação não encontrada.');
      this.carregando.set(false);
      return;
    }

    this.simulacaoService.buscarDetalhes(id).subscribe({
      next: (resposta) => {
        this.detalhes.set(resposta);
        this.atualizarGraficos(resposta);
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao carregar detalhes da simulação:', erro);
        this.erro.set('Não foi possível carregar os detalhes da simulação.');
        this.carregando.set(false);
      },
    });
  }

  atualizarGraficos(dados: SimulacaoDetalhes): void {
    const labels = dados.projecaoMensal.map((item) => `Mês ${item.mes}`);

    this.lineChartData.set({
      labels,
      datasets: [
        {
          data: dados.projecaoMensal.map((item) => item.saldoFinal),
          label: 'Saldo projetado',
          tension: 0.35,
          fill: false,
        },
        {
          data: dados.projecaoMensal.map((item) =>
            dados.resumo.valorInicial + dados.resumo.aporteMensal * item.mes
          ),
          label: 'Total investido',
          tension: 0.35,
          fill: false,
        },
      ],
    });

    this.pieChartData.set({
      labels: ['Total investido', 'Rendimento'],
      datasets: [
        {
          data: [
            dados.resumo.totalInvestido,
            dados.resumo.totalRendimento,
          ],
        },
      ],
    });

    this.barChartData.set({
      labels,
      datasets: [
        {
          data: dados.projecaoMensal.map((item) => item.rendimento),
          label: 'Rendimento mensal',
        },
      ],
    });
  }

  voltar(): void {
    this.router.navigate(['/app/simulacoes']);
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  formatarTaxaMensal(valor: number): string {
    return `${(valor * 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}% a.m.`;
  }

  formatarPercentual(valor: number): string {
    return `${valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}%`;
  }

  formatarTipo(tipo: string): string {
    const tipos: Record<string, string> = {
      ACAO: 'Ação',
      TESOURO: 'Tesouro Direto',
      CDB: 'CDB',
      FUNDO_IMOBILIARIO: 'Fundo imobiliário',
      ETF: 'ETF',
    };

    return tipos[tipo] ?? tipo;
  }

  formatarRisco(risco: string): string {
    const riscos: Record<string, string> = {
      BAIXO: 'Baixo',
      MEDIO: 'Médio',
      ALTO: 'Alto',
    };

    return riscos[risco] ?? risco;
  }

  formatarPerfil(perfil: string): string {
    const perfis: Record<string, string> = {
      CONSERVADOR: 'Conservador',
      MODERADO: 'Moderado',
      ARROJADO: 'Arrojado',
    };

    return perfis[perfil] ?? perfil;
  }

}
