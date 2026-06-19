import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Simulation } from '../../../core/services/simulation';
import { ResumoSimulacoes,
  SimulacaoListagem} from '../../../core/models/simulation.model';

@Component({
  selector: 'app-simulations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simulations.html',
  styleUrl: './simulations.scss',
})
export class Simulations implements OnInit {

  resumo: ResumoSimulacoes | null = null;
  simulacoes: SimulacaoListagem[] = [];

  carregando = false;
  erro = '';

  constructor(
    private Simulation: Simulation,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarPagina();
  }

  carregarPagina(): void {
    this.carregando = true;
    this.erro = '';

    forkJoin({
      resumo: this.Simulation.buscarResumo(),
      simulacoes: this.Simulation.listarSimulacoes()
    }).subscribe({
      next: ({ resumo, simulacoes }) => {
        this.resumo = resumo;
        this.simulacoes = simulacoes;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar suas simulações.';
        this.carregando = false;
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

    this.Simulation.deletarSimulacao(id).subscribe({
      next: () => {
        this.carregarPagina();
      },
      error: () => {
        this.erro = 'Não foi possível excluir a simulação.';
      }
    });
  }

  formatarMoeda(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) {
    return 'R$ 0,00';
  }

  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'});
  }

  formatarPercentual(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) {
    return '0,00%';
  }

  return `${valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2})}%`;
  }

  formatarRentabilidade(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) {
    return '-';
  }

    return `${this.formatarPercentual(valor)} a.a`;
  }

  formatarData(data: string | null | undefined): string {
  if (!data) {
    return '-';
  }
    return new Date(data).toLocaleDateString('pt-BR');
  }

}
