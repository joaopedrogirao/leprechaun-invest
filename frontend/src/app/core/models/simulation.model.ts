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

export interface SimulacaoCalculoRequest {
  valorInicial: number;
  aporteMensal: number;
  periodoMeses: number;
  objetivo: string;
  nivelRiscoDesejado: string;
}

export interface SimulacaoSalvarRequest {
  nome: string;
  valorInicial: number;
  aporteMensal: number;
  periodoMeses: number;
  objetivo: string;
  nivelRiscoDesejado: string;
}

export interface SimulacaoListagem {
  id: number;
  nome: string;
  investimento: string;
  valorInicial: number;
  aporteMensal: number;
  periodoMeses: number;
  taxaAnualUsada: number;
  valorFinal: number;
  totalRendimento: number;
  dataCriacao: string;
}

export interface ResumoSimulacoes {
  totalSimulacoesSalvas: number;
  melhorProjecao: number;
  rentabilidadeMediaTotal: number;
  ultimaSimulacao: string | null;
}

export interface InvestimentoRecomendado {
  id: number;
  nome: string;
  tipo: string;
  nivelRisco: string;
  perfilRecomendado: string;
  motivoRecomendacao: string;
}

export interface ResumoSimulacaoDetalhada {
  valorInicial: number;
  aporteMensal: number;
  periodoMeses: number;
  taxaMensalUsada: number;
  valorFinal: number;
  totalInvestido: number;
  totalRendimento: number;
}

export interface ProjecaoMensal {
  mes: number;
  saldoInicial: number;
  aporte: number;
  rendimento: number;
  saldoFinal: number;
}

export interface SimulacaoDetalhes {
  investimentoRecomendado: InvestimentoRecomendado;
  resumo: ResumoSimulacaoDetalhada;
  projecaoMensal: ProjecaoMensal[];
}