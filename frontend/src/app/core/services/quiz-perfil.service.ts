import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface QuizPerfilPayload {
  respostas: number[];
}

export interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
  perfilInvestidor: string | null;
}

@Injectable({ providedIn: 'root' })
export class QuizPerfilService {
  private http = inject(HttpClient);

  
  definirPerfilInvestidor(payload: QuizPerfilPayload) {
    return this.http.post<UsuarioDTO>('/usuarios/me/perfil-investidor', payload);
  }

  refazerPerfilInvestidor(payload: QuizPerfilPayload) {
    return this.http.put<UsuarioDTO>('/usuarios/me/perfil-investidor', payload);
  }
}
