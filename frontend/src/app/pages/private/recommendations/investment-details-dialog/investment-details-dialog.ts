import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';

import { InvestmentService, InvestimentoDTO } from '../../../../core/services/investment';

@Component({
  selector: 'app-investment-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './investment-details-dialog.html',
  styleUrl: './investment-details-dialog.scss',
})
export class InvestmentDetailsDialog implements OnInit {
  investimento = signal<InvestimentoDTO | null>(null);
  carregando = signal(true);
  erro = signal('');

  constructor(
    public dialogRef: MatDialogRef<InvestmentDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private investmentService: InvestmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarDetalhes();
  }

  carregarDetalhes(): void {
    this.investmentService.buscarPorId(this.data.id).subscribe({
      next: (dados) => {
        this.investimento.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes do investimento:', err);
        this.erro.set('Não foi possível carregar os detalhes deste investimento.');
        this.carregando.set(false);
      },
    });
  }

  fechar(): void {
    this.dialogRef.close();
  }

  simular(): void {
    this.dialogRef.close();
    this.router.navigate(['/app/simulacoes/nova']);
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  formatarTipo(tipo: string): string {
    const mapa: Record<string, string> = {
      TESOURO: 'Tesouro Direto',
      CDB: 'CDB Bancário',
      LCI_LCA: 'LCI / LCA',
      FII: 'Fundos Imobiliários',
      ACAO: 'Ações',
      ETF: 'ETF',
    };
    return mapa[tipo] ?? tipo;
  }

  formatarRisco(risco: string): string {
    const mapa: Record<string, string> = {
      BAIXO: 'Baixo',
      MEDIO: 'Médio',
      ALTO: 'Alto',
    };
    return mapa[risco] ?? risco;
  }

  getCorRisco(risco: string): string {
    switch (risco) {
      case 'BAIXO': return '#2f7d43';
      case 'MEDIO': return '#c87b00';
      case 'ALTO': return '#c62828';
      default: return '#607064';
    }
  }

  getBgRisco(risco: string): string {
    switch (risco) {
      case 'BAIXO': return '#e6f4e9';
      case 'MEDIO': return '#fff3d8';
      case 'ALTO': return '#fdecec';
      default: return '#f5f8f4';
    }
  }

  formatarObjetivo(objetivo: string): string {
    const mapa: Record<string, string> = {
      RESERVA_EMERGENCIA: 'Reserva e segurança',
      CURTO_PRAZO: 'Curto prazo',
      MEDIO_PRAZO: 'Médio prazo',
      LONGO_PRAZO: 'Longo prazo',
      RENDA_MENSAL: 'Renda passiva mensal',
      CRESCIMENTO_PATRIMONIAL: 'Crescimento patrimonial',
    };
    return mapa[objetivo] ?? objetivo;
  }

  formatarHorizonte(horizonte: string): string {
    const mapa: Record<string, string> = {
      CURTO: 'Curto prazo (até 1 ano)',
      MEDIO: 'Médio prazo (1 a 5 anos)',
      LONGO: 'Longo prazo (acima de 5 anos)',
    };
    return mapa[horizonte] ?? horizonte;
  }

  formatarLiquidez(liquidez: string): string {
    const mapa: Record<string, string> = {
      ALTA: 'Alta (D+0 a D+1)',
      MEDIA: 'Média (Dias a meses)',
      BAIXA: 'Baixa (Apenas no vencimento)',
    };
    return mapa[liquidez] ?? liquidez;
  }
}
