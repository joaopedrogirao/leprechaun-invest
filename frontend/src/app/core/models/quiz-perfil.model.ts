export interface OpcaoQuiz {
  texto: string;
  pontos: number;
}

export interface PerguntaQuiz {
  titulo: string;
  descricao: string;
  icone: string;
  opcoes: OpcaoQuiz[];
}

export const PERGUNTAS_QUIZ: PerguntaQuiz[] = [
  {
    titulo: 'Qual é o seu principal objetivo ao investir?',
    descricao: 'Selecione a opção que melhor descreve suas metas financeiras.',
    icone: 'flag',
    opcoes: [
      { texto: 'Proteger meu patrimônio da inflação', pontos: 1 },
      { texto: 'Ter uma renda extra com segurança', pontos: 2 },
      { texto: 'Fazer meu dinheiro crescer no longo prazo', pontos: 3 },
    ],
  },
  {
    titulo: 'Como você reagiria a uma queda de 20% nos seus investimentos?',
    descricao: 'Pense em como você se sentiria e o que faria.',
    icone: 'trending_down',
    opcoes: [
      { texto: 'Ficaria muito preocupado e resgataria tudo', pontos: 1 },
      { texto: 'Ficaria desconfortável, mas aguardaria', pontos: 2 },
      { texto: 'Aproveitaria para investir mais', pontos: 3 },
    ],
  },
  {
    titulo: 'Por quanto tempo pretende deixar o dinheiro investido?',
    descricao: 'O horizonte de tempo influencia diretamente no tipo de investimento ideal.',
    icone: 'schedule',
    opcoes: [
      { texto: 'Menos de 1 ano', pontos: 1 },
      { texto: 'Entre 1 e 5 anos', pontos: 2 },
      { texto: 'Mais de 5 anos', pontos: 3 },
    ],
  },
  {
    titulo: 'Qual a sua experiência com investimentos?',
    descricao: 'Nos conte sobre seu conhecimento no mercado financeiro.',
    icone: 'school',
    opcoes: [
      { texto: 'Nenhuma, sou iniciante', pontos: 1 },
      { texto: 'Já investi em renda fixa ou fundos', pontos: 2 },
      { texto: 'Invisto em ações, criptomoedas e derivativos', pontos: 3 },
    ],
  },
  {
    titulo: 'Se você ganhasse R$ 50.000 hoje, o que faria?',
    descricao: 'Escolha a opção mais próxima do que você realmente faria.',
    icone: 'savings',
    opcoes: [
      { texto: 'Colocaria tudo na poupança ou renda fixa segura', pontos: 1 },
      { texto: 'Dividiria entre renda fixa e variável', pontos: 2 },
      { texto: 'Investiria a maior parte em renda variável', pontos: 3 },
    ],
  },
];
