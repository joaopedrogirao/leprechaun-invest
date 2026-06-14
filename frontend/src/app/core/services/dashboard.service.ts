import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResumoCarteira {
  totalInvestido: number;
  lucroAcumulado: number;
  rentabilidadePercentual: number;
  patrimonioProjetado: number;
}

export interface RecomendacaoPersonalizada {
  nome: string;
  risco: string;
  rentabilidade: string;
}

export interface MelhorSimulacao {
  id: number;
  nome: string;
  investimento: string;
  valorFinal: number;
  totalInvestido: number;
  totalRendimento: number;
}

export interface GraficoRendimento {
  mes: number;
  valorInvestido: number;
  valorProjetado: number;
}

export interface DashboardResponse {
  resumoCarteira: ResumoCarteira;
  recomendacoesPersonalizadas: RecomendacaoPersonalizada[];
  melhorSimulacao: MelhorSimulacao | null;
  graficoRendimentos: GraficoRendimento[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService  {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/dashboard';

  buscarDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(this.apiUrl, {
      withCredentials: true
    });
  }
}
