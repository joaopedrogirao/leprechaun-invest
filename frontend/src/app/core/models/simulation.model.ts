import { tipoInvestimento } from './investment.model';

export interface Simulation {
  id: number;
  titulo: string;
  tipo: tipoInvestimento;
  valorInicial: number;
  aporteMensal: number;
  taxaJuros: number;
  periodoMeses: number;
  totalInvestido: number;
  totalJuros: number;
  montanteFinal: number;
  dataCriacao: Date;
}