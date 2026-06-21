import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface InvestimentoDTO {
  id: number;
  nome: string;
  tipo: string;
  perfilRecomendado: string;
  nivelRisco: string;
  objetivoRecomendado: string;
  horizonteRecomendado: string;
  liquidez: string;
  indexador: string;
  valorMinimo: number;
  descricao: string;
}

@Injectable({
  providedIn: 'root',
})
export class InvestmentService {
  private http = inject(HttpClient);

  listarTodos(): Observable<InvestimentoDTO[]> {
    return this.http.get<InvestimentoDTO[]>('/investimentos');
  }

  buscarPorId(id: number): Observable<InvestimentoDTO> {
    return this.http.get<InvestimentoDTO>(`/investimentos/${id}`);
  }
}
