import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResumoSimulacoes,
  SimulacaoCalculoRequest,
  SimulacaoDetalhes,
  SimulacaoListagem,
  SimulacaoSalvarRequest} from '../models/simulation.model';

@Injectable({
  providedIn: 'root',
})
export class Simulation {

  private readonly apiUrl = 'http://localhost:8080/simulacao';

   constructor(private http: HttpClient) {}

   buscarResumo(): Observable<ResumoSimulacoes> {
    return this.http.get<ResumoSimulacoes>(
      `${this.apiUrl}/resumo`,
      { withCredentials: true }
    );
  }

  listarSimulacoes(): Observable<SimulacaoListagem[]> {
    return this.http.get<SimulacaoListagem[]>(
      this.apiUrl,
      { withCredentials: true }
    );
  }

  buscarDetalhes(id: number): Observable<SimulacaoDetalhes> {
    return this.http.get<SimulacaoDetalhes>(
      `${this.apiUrl}/${id}`,
      { withCredentials: true }
    );
  }

  calcularSimulacao(dados: SimulacaoCalculoRequest): Observable<SimulacaoDetalhes> {
    return this.http.post<SimulacaoDetalhes>(
      `${this.apiUrl}/calcular`,
      dados,
      { withCredentials: true }
    );
  }

  salvarSimulacao(dados: SimulacaoSalvarRequest): Observable<SimulacaoDetalhes> {
    return this.http.post<SimulacaoDetalhes>(
      this.apiUrl,
      dados,
      { withCredentials: true }
    );
  }

  deletarSimulacao(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { withCredentials: true }
    );
  }

}
