import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);

  login(email: string, senha: string) {
    const body = new URLSearchParams();
    body.set('email', email);
    body.set('senha', senha);

    return this.http.post('/login', body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  register(dados: any) {
    return this.http.post('/usuarios', dados, { responseType: 'text' });
  }

  buscarUsuarioLogado() {
    return this.http.get<any>('/usuarios/me');
  }

  salvarUsuario(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuario() {
    const dados = localStorage.getItem('usuario');
    return dados ? JSON.parse(dados) : null;
  }

  getPrimeiroAcesso(): boolean {
    const usuario = this.getUsuario();
    if (!usuario) return false;
    return !usuario.perfilInvestidor;
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('usuario');
  }

  limparSessaoLocal(): void {
    localStorage.removeItem('usuario');
  }

  logout() {
    this.http.post('/logout', {}).subscribe();
    this.limparSessaoLocal();
    this.router.navigate(['/login']);
  }

  solicitarRecuperacaoSenha(email: string) {
    return this.http.post<{ mensagem: string }>('/usuarios/esqueci-minha-senha', { email });
  }

  redefinirSenha(token: string, novaSenha: string) {
    return this.http.post<{ mensagem: string }>('/usuarios/redefinir-senha', { token, novaSenha });
  }
}