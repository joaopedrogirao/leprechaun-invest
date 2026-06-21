import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {
  ComparacaoService,
  SimulacaoListagem,
  CenarioComparado,
  SerieGraficoComparacao,
} from '../../../core/services/comparacao.service';

@Component({
  selector: 'app-compare-scenarios',
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './compare-scenarios.html',
  styleUrl: './compare-scenarios.scss',
})
export class CompareScenarios implements OnInit {
  private comparacaoService = inject(ComparacaoService);

  carregando = signal(true);
  comparando = signal(false);
  erroCarregamento = signal('');

  simulacoesDisponiveis = signal<SimulacaoListagem[]>([]);
  cenarios = signal<CenarioComparado[]>([]);
  graficoSeries = signal<SerieGraficoComparacao[]>([]);

  cenario1Id: number | null = null;
  cenario2Id: number | null = null;
  cenario3Id: number | null = null;

  indicadores = [
    { label: 'Valor inicial', campo: 'valorInicial' as const, formato: 'moeda' },
    { label: 'Aporte mensal', campo: 'aporteMensal' as const, formato: 'moeda' },
    { label: 'Prazo', campo: 'periodoMeses' as const, formato: 'prazo' },
    { label: 'Rentabilidade anual', campo: 'taxaAnualUsada' as const, formato: 'percentual' },
    { label: 'Montante final estimado', campo: 'valorFinal' as const, formato: 'moeda' },
    { label: 'Rendimento total estimado', campo: 'totalRendimento' as const, formato: 'moeda' },
  ];

  lineChartType: 'line' = 'line';
  chartColors = ['#2f7d43', '#1a6bb5', '#9a6a00'];

  lineChartData = signal<ChartConfiguration<'line'>['data']>({
    labels: [],
    datasets: [],
  });

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 16,
          font: { size: 13, weight: 'bold' },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const valor = Number(context.raw);
            return `${context.dataset.label}: ${this.formatarMoeda(valor)}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => this.formatarMoeda(Number(value)),
        },
        grid: {
          color: 'rgba(47, 125, 67, 0.08)',
        },
      },
      x: {
        grid: {
          color: 'rgba(47, 125, 67, 0.05)',
        },
      },
    },
  };

  ngOnInit(): void {
    this.carregarSimulacoes();
  }

  carregarSimulacoes(): void {
    this.comparacaoService.listarSimulacoes().subscribe({
      next: (simulacoes) => {
        this.simulacoesDisponiveis.set(simulacoes);
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao carregar simulações:', erro);
        this.erroCarregamento.set('Não foi possível carregar as simulações.');
        this.carregando.set(false);
      },
    });
  }

  compararSeValido(): void {
    if (this.podeComparar()) {
      this.compararCenarios();
    }
  }

  compararCenarios(): void {
    const ids: number[] = [];
    if (this.cenario1Id) ids.push(this.cenario1Id);
    if (this.cenario2Id) ids.push(this.cenario2Id);
    if (this.cenario3Id) ids.push(this.cenario3Id);

    if (ids.length < 2) {
      this.erroCarregamento.set('Selecione pelo menos 2 simulações para comparar.');
      return;
    }

    this.erroCarregamento.set('');
    this.comparando.set(true);

    this.comparacaoService.compararSimulacoes(ids).subscribe({
      next: (resposta) => {
        this.cenarios.set(resposta.cenarios);
        this.graficoSeries.set(resposta.grafico);
        this.atualizarGrafico(resposta.grafico);
        this.comparando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao comparar simulações:', erro);
        this.erroCarregamento.set('Erro ao comparar as simulações. Tente novamente.');
        this.comparando.set(false);
      },
    });
  }

  podeComparar(): boolean {
    return this.cenario1Id !== null && this.cenario2Id !== null;
  }

  simulacoesFiltradas(excluirIds: (number | null)[]): SimulacaoListagem[] {
    return this.simulacoesDisponiveis().filter(
      (s) => !excluirIds.filter(Boolean).includes(s.id)
    );
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  formatarPercentual(valor: number): string {
    return `${valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}% a.a`;
  }

  formatarPrazo(meses: number): string {
    if (meses >= 12) {
      const anos = Math.floor(meses / 12);
      const resto = meses % 12;
      if (resto === 0) return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
      return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${resto} ${resto === 1 ? 'mês' : 'meses'}`;
    }
    return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  }

  formatarValorCenario(cenario: CenarioComparado, campo: string, formato: string): string {
    const valor = (cenario as any)[campo];
    switch (formato) {
      case 'moeda':
        return this.formatarMoeda(valor);
      case 'percentual':
        return this.formatarPercentual(valor);
      case 'prazo':
        return this.formatarPrazo(valor);
      default:
        return String(valor);
    }
  }

  atualizarGrafico(series: SerieGraficoComparacao[]): void {
    if (!series.length) return;

    const maxMeses = Math.max(...series.map((s) => s.pontos.length));

    const labels: string[] = [];
    for (let i = 0; i <= maxMeses; i++) {
      if (i % 12 === 0) {
        const anos = i / 12;
        labels.push(`${anos} ${anos === 1 ? 'ano' : 'anos'}`);
      }
    }

    const dashPatterns: number[][] = [[], [8, 4], [3, 3]];

    const datasets = series.map((serie, index) => ({
      data: serie.pontos
        .filter((_, i) => i % 12 === 0 || i === serie.pontos.length - 1)
        .map((p) => p.saldoFinal),
      label: `Cenário ${index + 1} (${serie.nome})`,
      tension: 0.35,
      fill: false,
      borderColor: this.chartColors[index],
      backgroundColor: this.chartColors[index],
      borderDash: dashPatterns[index] || [],
      pointRadius: 3,
      pointHoverRadius: 6,
    }));

    this.lineChartData.set({ labels, datasets });
  }

  exportarComparacao(): void {
    const cenarios = this.cenarios();
    if (!cenarios.length) return;

    let csv = 'Indicador';
    cenarios.forEach((c, i) => {
      csv += `,Cenário ${i + 1} (${c.nome})`;
    });
    csv += '\n';

    this.indicadores.forEach((ind) => {
      csv += ind.label;
      cenarios.forEach((c) => {
        csv += `,${this.formatarValorCenario(c, ind.campo, ind.formato)}`;
      });
      csv += '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'comparacao_cenarios.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  limparComparacao(): void {
    this.cenario1Id = null;
    this.cenario2Id = null;
    this.cenario3Id = null;
    this.cenarios.set([]);
    this.graficoSeries.set([]);
    this.erroCarregamento.set('');
    this.lineChartData.set({ labels: [], datasets: [] });
  }
}
