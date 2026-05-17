export interface Investiment{
    id: number;
    tipo: tipoInvestimento;
    nome: string;
    risco: nivelRisco;
    rentabilidade: string;
    prazoIndicado: string;
    perfilIndicado: perfilInvestidor;

}

export type tipoInvestimento = 
|'Tesouro Direto'
|'CDB'
|'Ações'
|'Fundos Imobiliários';

export type nivelRisco =
|'Baixo'
|'Moderado'
|'Alto';

export type perfilInvestidor =
|'Conservador'
|'Moderado'
|'Arrojado'