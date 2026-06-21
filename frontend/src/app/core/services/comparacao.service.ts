import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SimulacaoListagem {
  id: number;
  nome: string;
  investimento: string;
  valorInicial: number;
  aporteMensal: number;
  periodoMeses: number;
  valorFinal: number;
  totalRendimento: number;
  dataCriacao: string;
}

export interface CenarioComparado {
  id: number;
  nome: string;
  investimento: string;
  valorInicial: number;
  aporteMensal: number;
  periodoMeses: number;
  taxaAnualUsada: number;
  taxaMensalUsada: number;
  valorFinal: number;
  totalInvestido: number;
  totalRendimento: number;
}

export interface PontoGraficoComparacao {
  mes: number;
  saldoFinal: number;
}

export interface SerieGraficoComparacao {
  simulacaoId: number;
  nome: string;
  pontos: PontoGraficoComparacao[];
}

export interface ComparacaoSimulacoesResponse {
  cenarios: CenarioComparado[];
  grafico: SerieGraficoComparacao[];
}

@Injectable({
  providedIn: 'root',
})
export class ComparacaoService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/simulacao';

  listarSimulacoes(): Observable<SimulacaoListagem[]> {
    return this.http.get<SimulacaoListagem[]>(this.apiUrl, {
      withCredentials: true,
    });
  }

  compararSimulacoes(simulacaoIds: number[]): Observable<ComparacaoSimulacoesResponse> {
    return this.http.post<ComparacaoSimulacoesResponse>(
      `${this.apiUrl}/comparar`,
      { simulacaoIds },
      { withCredentials: true }
    );
  }
}
