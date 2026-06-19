import { Component, OnInit, inject, signal,computed } from '@angular/core';
import { Router } from '@angular/router';


import { Simulation } from '../../../core/services/simulation';
import { ResumoSimulacoes,SimulacaoListagem} from '../../../core/models/simulation.model';

type CampoOrdenacao =
  | 'dataCriacao'
  | 'valorFinal'
  | 'totalRendimento'
  | 'taxaAnualUsada'
  | 'periodoMeses'
  | 'valorInicial'
  | 'aporteMensal'
  | 'nome'
  | 'investimento';

  type DirecaoOrdenacao = 'asc' | 'desc';

  type OrdenacaoSimulacao = {
  campo: CampoOrdenacao;
  direcao: DirecaoOrdenacao;
};

@Component({
  selector: 'app-simulations',
  standalone: true,
  imports: [],
  templateUrl: './simulations.html',
  styleUrl: './simulations.scss',
})

export class Simulations implements OnInit {

  private simulation = inject(Simulation);
  private router = inject(Router);

  carregandoResumo = signal(true);
  carregandoSimulacoes = signal(true);
  erroCarregamento = signal('');
  mostrarOpcoesOrdenacao = signal(false);

  ordenacao = signal<OrdenacaoSimulacao>({
    campo: 'dataCriacao',
    direcao: 'desc',
  });


  resumo = signal<ResumoSimulacoes>({
    totalSimulacoesSalvas: 0,
    melhorProjecao: 0,
    rentabilidadeMediaTotal: 0,
    ultimaSimulacao: null
  });

  simulacoes = signal<SimulacaoListagem[]>([]);

  melhoresSimulacoes = computed(() => {
    return [...this.simulacoes()]
      .sort((a, b) => b.valorFinal - a.valorFinal)
      .slice(0, 2);
  });

  ngOnInit(): void {
    this.carregarResumo();
    this.carregarSimulacoes();
  }

  carregarResumo(): void {
    this.carregandoResumo.set(true);

    this.simulation.buscarResumo().subscribe({
      next: (resposta) => {
        this.resumo.set(resposta);
        this.carregandoResumo.set(false);
      },
      error: (erro) => {
        console.error('Erro ao carregar resumo das simulações:', erro);

        this.erroCarregamento.set('Não foi possível carregar o resumo das simulações.');
        this.carregandoResumo.set(false);
      }
    });
  }

  carregarSimulacoes(): void {
    this.carregandoSimulacoes.set(true);

    this.simulation.listarSimulacoes().subscribe({
      next: (resposta) => {
        this.simulacoes.set(resposta);
        this.carregandoSimulacoes.set(false);
      },
      error: (erro) => {
        console.error('Erro ao carregar simulações:', erro);

        this.erroCarregamento.set('Não foi possível carregar suas simulações.');
        this.carregandoSimulacoes.set(false);
      }
    });
  }

  novaSimulacao(): void {
    this.router.navigate(['/app/simulacoes/nova']);
  }

  verDetalhes(id: number): void {
    this.router.navigate(['/app/simulacoes', id]);
  }

  excluirSimulacao(id: number): void {
    const confirmar = confirm('Deseja realmente excluir esta simulação?');

    if (!confirmar) {
      return;
    }

    this.simulation.deletarSimulacao(id).subscribe({
      next: () => {
        this.carregarResumo();
        this.carregarSimulacoes();
      },
      error: (erro) => {
        console.error('Erro ao excluir simulação:', erro);
        this.erroCarregamento.set('Não foi possível excluir a simulação.');
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

  formatarData(data: string | null): string {
    if (!data) {
      return '-';
    }

    return new Date(data).toLocaleDateString('pt-BR');
  }

  alternarOpcoesOrdenacao(): void {
    this.mostrarOpcoesOrdenacao.update((valor) => !valor);
  }

  ordenarPor(campo: CampoOrdenacao, direcao: DirecaoOrdenacao): void {
    this.ordenacao.set({ campo, direcao });
    this.mostrarOpcoesOrdenacao.set(false);
  }

  simulacoesOrdenadas = computed(() => {
    const ordenacao = this.ordenacao();
    return [...this.simulacoes()].sort((a, b) => {
      const valorA = a[ordenacao.campo];
      const valorB = b[ordenacao.campo];

      if (ordenacao.campo === 'nome' || ordenacao.campo === 'investimento') {
        const comparacao = String(valorA).localeCompare(String(valorB), 'pt-BR');
        return ordenacao.direcao === 'asc' ? comparacao : -comparacao;
      }

      if (ordenacao.campo === 'dataCriacao') {
        const dataA = new Date(String(valorA)).getTime();
        const dataB = new Date(String(valorB)).getTime();

        return ordenacao.direcao === 'asc'? dataA - dataB: dataB - dataA;
      }

      const numeroA = Number(valorA);
      const numeroB = Number(valorB);

      return ordenacao.direcao === 'asc'? numeroA - numeroB: numeroB - numeroA;

    });
  });
}
