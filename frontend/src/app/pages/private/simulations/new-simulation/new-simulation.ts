import { Component, inject, signal  } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


import { Simulation } from '../../../../core/services/simulation';
import { SimulacaoCalculoRequest, SimulacaoDetalhes, SimulacaoSalvarRequest } from '../../../../core/models/simulation.model';


@Component({
  selector: 'app-new-simulation',
  imports: [CommonModule, ReactiveFormsModule, BaseChartDirective],
  templateUrl: './new-simulation.html',
  styleUrl: './new-simulation.scss',
})
export class NewSimulation {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private simulacaoService = inject(Simulation);


  resultado = signal<SimulacaoDetalhes | null>(null);

  calculando = signal(false);
  salvando = signal(false);

  erro = signal('');
  sucesso = signal('');

  formSimulacao = this.fb.group({
    nome: ['', Validators.required],
    valorInicial: [null, [Validators.required, Validators.min(0.01)]],
    aporteMensal: [null, [Validators.required, Validators.min(0)]],
    periodoMeses: [null, [Validators.required, Validators.min(1)]],
    objetivo: ['', Validators.required],
    nivelRiscoDesejado: ['', Validators.required],
  });

  calcularSimulacao(): void {
    if (this.camposDeCalculoInvalidos()) {
      this.erro.set('Preencha valor inicial, aporte mensal, prazo, objetivo e risco antes de calcular.');
      return;
    }

    this.erro.set('');
    this.sucesso.set('');
    this.calculando.set(true);

    const dados: SimulacaoCalculoRequest = this.montarRequestCalculo();

    console.log('Enviando cálculo:', dados);

    this.simulacaoService.calcularSimulacao(dados).subscribe({
      next: (resposta) => {
        this.resultado.set(resposta);
        this.atualizarGrafico();
        this.calculando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao calcular simulação:', erro);
        this.erro.set('Não foi possível calcular a simulação.');
        this.calculando.set(false);
      }
    });
  }

  private camposDeCalculoInvalidos(): boolean {
    const valorInicial = this.formSimulacao.get('valorInicial')?.invalid;
    const aporteMensal = this.formSimulacao.get('aporteMensal')?.invalid;
    const periodoMeses = this.formSimulacao.get('periodoMeses')?.invalid;
    const objetivo = this.formSimulacao.get('objetivo')?.invalid;
    const nivelRiscoDesejado = this.formSimulacao.get('nivelRiscoDesejado')?.invalid;

    return !!valorInicial || !!aporteMensal || !!periodoMeses || !!objetivo || !!nivelRiscoDesejado;
  }

  salvarSimulacao(): void {
    if (!this.resultado()) {
      this.erro.set('Calcule a simulação antes de salvar.');
      return;
    }

    if (this.formSimulacao.invalid) {
      this.formSimulacao.markAllAsTouched();
      this.erro.set('Preencha todos os campos obrigatórios antes de salvar.');
      return;
    }

    this.erro.set('');
    this.sucesso.set('');
    this.salvando.set(true);

    const dados: SimulacaoSalvarRequest = this.montarRequestSalvar();

    this.simulacaoService.salvarSimulacao(dados).subscribe({
      next: () => {
        this.salvando.set(false);
        this.sucesso.set('Simulação salva com sucesso.');
        this.router.navigate(['/app/simulacoes']);
      },
      error: (erro) => {
        console.error('Erro ao salvar simulação:', erro);
        this.erro.set('Não foi possível salvar a simulação.');
        this.salvando.set(false);
      }
    });
  }

  limparCampos(): void {
    this.formSimulacao.reset({
      nome: '',
      valorInicial: null,
      aporteMensal: null,
      periodoMeses: null,
      objetivo: '',
      nivelRiscoDesejado: '',
    });

    this.resultado.set(null);
    this.atualizarGrafico();
    this.erro.set('');
    this.sucesso.set('');
  }

  voltar(): void {
    this.router.navigate(['/app/simulacoes']);
  }

  private montarRequestCalculo(): SimulacaoCalculoRequest {
    const form = this.formSimulacao.getRawValue();

    return {
      valorInicial: Number(form.valorInicial),
      aporteMensal: Number(form.aporteMensal),
      periodoMeses: Number(form.periodoMeses),
      objetivo: form.objetivo ?? '',
      nivelRiscoDesejado: form.nivelRiscoDesejado ?? ''
    };
  }

  private montarRequestSalvar(): SimulacaoSalvarRequest {
    const form = this.formSimulacao.getRawValue();

    return {
      nome: form.nome ?? '',
      valorInicial: Number(form.valorInicial),
      aporteMensal: Number(form.aporteMensal),
      periodoMeses: Number(form.periodoMeses),
      objetivo: form.objetivo ?? '',
      nivelRiscoDesejado: form.nivelRiscoDesejado ?? ''
    };
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  formatarTaxaMensal(valor: number): string {
    return `${(valor * 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}% a.m.`;
  }

  lineChartType: 'line' = 'line';
  lineChartData = signal<ChartConfiguration<'line'>['data']>({
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Total investido',
        tension: 0.35,
        fill: false
      },
      {
        data: [],
        label: 'Saldo projetado',
        tension: 0.35,
        fill: false
      }
    ]
  });

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const valor = Number(context.raw);

            return `${context.dataset.label}: ${this.formatarMoeda(valor)}`;
          }
        }
      }
    },
    scales: {
      y: {
         ticks: {
          callback: (value) => this.formatarMoeda(Number(value))
        }
      }
    }
  };

  atualizarGrafico(): void {
    const dadosResultado = this.resultado();
    if (!dadosResultado) {
      this.lineChartData.set({
        labels: [],
        datasets: [
          {
            data: [],
            label: 'Total investido',
            tension: 0.35,
            fill: false
          },
          {
            data: [],
            label: 'Saldo projetado',
            tension: 0.35,
            fill: false
          }
        ]
      });

      return;
    }

    this.lineChartData.set({
      labels: dadosResultado.projecaoMensal.map((item) => `Mês ${item.mes}`),
      datasets: [
        {
          data: dadosResultado.projecaoMensal.map((item) =>
            dadosResultado.resumo.valorInicial + dadosResultado.resumo.aporteMensal * item.mes
        ),
        label: 'Total investido',
        tension: 0.35,
        fill: false
        },
        {
          data: dadosResultado.projecaoMensal.map((item) => item.saldoFinal),
          label: 'Saldo projetado',
          tension: 0.35,
          fill: false
        }
      ]
    });
  }
}
