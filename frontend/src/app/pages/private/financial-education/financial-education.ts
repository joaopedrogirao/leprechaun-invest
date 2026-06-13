import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

interface TopicItem {
  titulo: string;
  icone: string;
  resumo: string;
}

interface GlossarioItem {
  termo: string;
  descricao: string;
  categoria: string;
}

@Component({
  selector: 'app-financial-education',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './financial-education.html',
  styleUrl: './financial-education.scss',
})
export class FinancialEducation {

  tiposInvestimento: TopicItem[] = [
    {
      titulo: 'Tesouro Direto',
      icone: 'account_balance',
      resumo: 'Programa do Governo Federal que permite investir em títulos públicos com baixo risco. Existem opções prefixadas (taxa fixa), pós-fixadas (atreladas à Selic) e híbridas (IPCA + taxa fixa). Ideal para reserva de emergência e objetivos de médio a longo prazo, com liquidez diária garantida pelo Tesouro Nacional.',
    },
    {
      titulo: 'CDB',
      icone: 'savings',
      resumo: 'Certificado de Depósito Bancário — título emitido por bancos para captar recursos. Pode ser prefixado, pós-fixado (geralmente atrelado ao CDI) ou atrelado à inflação. Possui proteção do FGC até R$ 250 mil por CPF/instituição. Boa alternativa à poupança com rendimentos superiores.',
    },
    {
      titulo: 'Fundos Imobiliários',
      icone: 'apartment',
      resumo: 'FIIs permitem investir no mercado imobiliário de forma acessível, sem precisar comprar um imóvel. Distribuem rendimentos mensais (geralmente isentos de IR para pessoa física) e são negociados na B3 como ações. Podem ser de tijolo (imóveis físicos), papel (títulos de crédito) ou híbridos.',
    },
    {
      titulo: 'Ações (B3)',
      icone: 'trending_up',
      resumo: 'Ações representam frações do capital de uma empresa listada na bolsa de valores (B3). Ao comprá-las, você se torna sócio da empresa e pode lucrar com a valorização do preço e com dividendos. Maior potencial de retorno a longo prazo, mas também maior volatilidade.',
    },
  ];

  conceitosFundamentais: TopicItem[] = [
    {
      titulo: 'Juros Compostos',
      icone: 'functions',
      resumo: 'Os juros compostos são calculados sobre o valor principal mais os juros acumulados anteriormente — o famoso "juros sobre juros". É o principal motor de crescimento dos investimentos a longo prazo. Quanto mais tempo o dinheiro fica investido, maior o efeito multiplicador.',
    },
    {
      titulo: 'Liquidez',
      icone: 'water_drop',
      resumo: 'Liquidez é a facilidade com que você consegue transformar um investimento em dinheiro sem perda significativa de valor. Investimentos com alta liquidez (como Tesouro Selic) podem ser resgatados rapidamente, enquanto outros (como CDBs com carência) exigem aguardar o vencimento.',
    },
    {
      titulo: 'Diversificação',
      icone: 'pie_chart',
      resumo: 'Estratégia de distribuir seus investimentos entre diferentes classes de ativos (renda fixa, variável, fundos, etc.) para reduzir o risco da carteira. A ideia é que, se um investimento cair, outros podem compensar. "Não coloque todos os ovos na mesma cesta" é a regra de ouro.',
    },
    {
      titulo: 'Risco X Retorno',
      icone: 'balance',
      resumo: 'Relação fundamental dos investimentos: quanto maior o potencial de retorno, maior o risco envolvido. Renda fixa costuma oferecer retornos menores com mais segurança, enquanto renda variável pode render mais, mas com maior chance de perdas. Entender seu perfil de risco é essencial para escolher os investimentos certos.',
    },
  ];

  glossario: GlossarioItem[] = [
    {
      termo: 'CDI',
      descricao: 'Taxa de referência do mercado financeiro. A maioria dos CDBs paga um percentual do CDI (ex: 110% do CDI).',
      categoria: 'Renda Fixa',
    },
    {
      termo: 'Selic',
      descricao: 'Taxa básica de juros da economia, definida pelo Banco Central. Influencia diretamente toda a renda fixa.',
      categoria: 'Renda Fixa',
    },
    {
      termo: 'FGC',
      descricao: 'Fundo Garantidor de Crédito. Protege CDB, LCI e LCA até R$ 250 mil por CPF por instituição financeira.',
      categoria: 'Renda Fixa',
    },
    {
      termo: 'IPCA',
      descricao: 'Índice de inflação oficial do Brasil. Títulos IPCA+ garantem rendimento acima da inflação.',
      categoria: 'Renda Fixa',
    },
    {
      termo: 'Dividendos',
      descricao: 'Parte do lucro distribuída pelas empresas aos acionistas. Uma das formas de renda passiva em ações.',
      categoria: 'Renda Variável',
    },
    {
      termo: 'Volatilidade',
      descricao: 'Medida de quanto o preço de um ativo oscila. Alta volatilidade = maior risco e maior potencial de retorno.',
      categoria: 'Renda Variável',
    },
  ];
}
