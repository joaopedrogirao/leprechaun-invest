import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-private-layout',
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './private-layout.html',
  styleUrl: './private-layout.scss',
})
export class PrivateLayout {
  private authService = inject(AuthService);

  nomeUsuario = signal('');

  ngOnInit():void{
    const usuario = this.authService.getUsuario();
    this.nomeUsuario.set(usuario?.nome?.split(' ')[0] ?? 'Usuário');
  }

  navItems: NavItem[] = [
    { icon: 'dashboard',        label: 'Dashboard',            route: '/app/dashboard' },
    { icon: 'candlestick_chart', label: 'Simulações',          route: '/app/simulacoes' },
    { icon: 'recommend',        label: 'Recomendações',        route: '/app/recomendacoes' },
    { icon: 'person',           label: 'Perfil do Investidor', route: '/app/perfil' },
    { icon: 'school',           label: 'Educação Financeira',  route: '/app/educacao' },
    { icon: 'settings',         label: 'Configurações',        route: '/app/configuracoes' },
  ];

  logout(): void {
    this.authService.logout();
  }
}
