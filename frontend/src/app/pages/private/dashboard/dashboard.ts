import { Component, inject, OnInit, signal } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import{
  DashboardService,
  GraficoRendimento,
  MelhorSimulacao,
  RecomendacaoPersonalizada,
  ResumoCarteira
} from '../../../core/services/dashboard.service'

@Component({
  selector: 'app-dashboard',
  imports: [BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit{

  private dashboardService = inject(DashboardService);

  carregando = signal(true);
  erroCarregamento = signal('');

  resumoCarteira = signal<ResumoCarteira>({
    totalInvestido: 0,
    lucroAcumulado: 0,
    rentabilidadePercentual: 0,
    patrimonioProjetado: 0
  });

  recomendacoesPersonalizadas = signal<RecomendacaoPersonalizada[]>([]);
  melhorSimulacao = signal<MelhorSimulacao | null>(null);
  graficoRendimentos = signal<GraficoRendimento[]>([]);

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.dashboardService.buscarDashboard().subscribe({
      next: (resposta) => {
      console.log('Resposta recebida:', resposta);

        this.resumoCarteira.set(resposta.resumoCarteira);
        this.recomendacoesPersonalizadas.set(resposta.recomendacoesPersonalizadas);
        this.melhorSimulacao.set(resposta.melhorSimulacao);

        this.graficoRendimentos.set(resposta.graficoRendimentos);

        this.atualizarGrafico(resposta.graficoRendimentos);

        this.carregando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao carregar dashboard:', erro);

        this.erroCarregamento.set('Não foi possível carregar os dados do dashboard.');
        this.carregando.set(false);
      }
    });
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  formatarPercentual(valor: number): string {
    return `${valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}%`;
  }

  formatarRisco(risco: string): string {
    if (!risco) return '';

    return risco.charAt(0).toUpperCase() + risco.slice(1).toLowerCase();
  }

  lineChartType: 'line' = 'line';

  lineChartData = signal<ChartConfiguration<'line'>['data']>({
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Valor invstido',
        tension: 0.35,
        fill: false
      },
      {
        data: [],
        label: 'Valor projetado',
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
          label: (context)=>{
            const valor = Number(context.raw);

            return `${context.dataset.label}: ${this.formatarMoeda(valor)}`;
          }
        }
      }
    },

    scales: {
      y: {
        ticks: {
          callback: (value)=> this.formatarMoeda(Number(value))
        }
      }
    }
  };

  atualizarGrafico(dados: GraficoRendimento[]): void{
    this.lineChartData.set({
      labels: dados.map((item)=> `Mês ${item.mes}`),
      datasets: [
        {
          data: dados.map((item) => item.valorInvestido),
          label: 'Valor investido',
          tension: 0.35,
          fill: false
        },
        {
          data: dados.map((item) => item.valorProjetado),
          label: 'Valor projetado',
          tension: 0.35,
          fill: false
        }
      ]
    });
  }
}
