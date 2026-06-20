import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Simulation } from '../../../../core/services/simulation';
import { SimulacaoDetalhes, SimulacaoSalvarRequest  } from '../../../../core/models/simulation.model';

@Component({
  selector: 'app-simulation-details',
  imports: [CommonModule, BaseChartDirective, ReactiveFormsModule],
  templateUrl: './simulation-details.html',
  styleUrl: './simulation-details.scss',
})
export class SimulationDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private simulacaoService = inject(Simulation);

  private fb = inject(FormBuilder);

  modalEdicaoAberto = signal(false);
  atualizando = signal(false);
  erroEdicao = signal('');

  formEdicao = this.fb.group({
    nome: ['', Validators.required],
    valorInicial: [0, [Validators.required, Validators.min(0.01)]],
    aporteMensal: [0, [Validators.required, Validators.min(0)]],
    periodoMeses: [1, [Validators.required, Validators.min(1)]],
    objetivo: ['', Validators.required],
    nivelRiscoDesejado: ['', Validators.required],
  });

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

  formatarObjetivo(objetivo: string): string {
    const objetivos: Record<string, string> = {
      RESERVA_EMERGENCIA: 'Reserva de emergência',
      CURTO_PRAZO: 'Curto prazo',
      MEDIO_PRAZO: 'Médio prazo',
      LONGO_PRAZO: 'Longo prazo',
      RENDA_MENSAL: 'Renda mensal',
      CRESCIMENTO_PATRIMONIAL: 'Crescimento patrimonial',
    };

    return objetivos[objetivo] ?? objetivo;
  }

  formatarHorizonte(horizonte: string): string {
    const horizontes: Record<string, string> = {
      CURTO: 'Curto prazo',
      MEDIO: 'Médio prazo',
      LONGO: 'Longo prazo',
    };

    return horizontes[horizonte] ?? horizonte;
  }

  formatarData(data: string | null): string {
    if (!data) {
      return '-';
    }

    return new Date(data).toLocaleDateString('pt-BR');
  }

  abrirModalEdicao(): void {
    const dados = this.detalhes();

    if (!dados) {
      return;
    }

    this.formEdicao.patchValue({
      nome: dados.nome ?? '',
      valorInicial: dados.resumo.valorInicial,
      aporteMensal: dados.resumo.aporteMensal,
      periodoMeses: dados.resumo.periodoMeses,
      objetivo: dados.objetivo,
      nivelRiscoDesejado: dados.nivelRiscoDesejado,
    });

    this.erroEdicao.set('');
    this.modalEdicaoAberto.set(true);
  }

  fecharModalEdicao(): void {
    this.modalEdicaoAberto.set(false);
    this.erroEdicao.set('');
  }

  atualizarSimulacao(): void {
    const dadosAtuais = this.detalhes();

    if (!dadosAtuais?.id) {
      this.erroEdicao.set('Não foi possível identificar a simulação.');
      return;
    }

    if (this.formEdicao.invalid) {
      this.formEdicao.markAllAsTouched();
      this.erroEdicao.set('Preencha todos os campos corretamente.');
      return;
    }

    this.erroEdicao.set('');
    this.atualizando.set(true);

    const form = this.formEdicao.getRawValue();

    const request: SimulacaoSalvarRequest = {
      nome: form.nome ?? '',
      valorInicial: Number(form.valorInicial),
      aporteMensal: Number(form.aporteMensal),
      periodoMeses: Number(form.periodoMeses),
      objetivo: form.objetivo ?? '',
      nivelRiscoDesejado: form.nivelRiscoDesejado ?? '',
    };

    this.simulacaoService.atualizarSimulacao(dadosAtuais.id, request).subscribe({
      next: (resposta) => {
        this.detalhes.set(resposta);
        this.atualizarGraficos(resposta);
        this.atualizando.set(false);
        this.fecharModalEdicao();
      },
      error: (erro) => {
        console.error('Erro ao atualizar simulação:', erro);
        this.erroEdicao.set('Não foi possível atualizar a simulação.');
        this.atualizando.set(false);
      },
    });
  }

}
