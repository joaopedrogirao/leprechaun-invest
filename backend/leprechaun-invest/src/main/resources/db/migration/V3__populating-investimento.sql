INSERT INTO modelos_investimento
(nome, tipo, perfil_recomendado, nivel_risco, objetivo_recomendado, horizonte_recomendado, liquidez, indexador, percentual_indexador, taxa_fixa_anual, valor_minimo, codigo_api, descricao)
VALUES
    ('Tesouro Selic', 'TESOURO', 'CONSERVADOR', 'BAIXO', 'RESERVA_EMERGENCIA', 'CURTO', 'ALTA', 'SELIC', 100.00, NULL, 30.00, 'SELIC',
     'Título público indicado para quem busca segurança, baixo risco e liquidez.'),

    ('CDB 100% CDI', 'CDB', 'CONSERVADOR', 'BAIXO', 'CURTO_PRAZO', 'CURTO', 'MEDIA', 'CDI', 100.00, NULL, 100.00, 'CDI',
     'Investimento de renda fixa emitido por bancos, indicado para objetivos de curto prazo.'),

    ('LCI/LCA 90% CDI', 'LCI_LCA', 'CONSERVADOR', 'BAIXO', 'MEDIO_PRAZO', 'MEDIO', 'BAIXA', 'CDI', 90.00, NULL, 500.00, 'CDI',
     'Investimento de renda fixa isento de imposto de renda para pessoa física, geralmente indicado para médio prazo.'),

    ('Tesouro IPCA+', 'TESOURO', 'MODERADO', 'MEDIO', 'LONGO_PRAZO', 'LONGO', 'MEDIA', 'IPCA', NULL, 6.00, 30.00, 'IPCA',
     'Título público que combina inflação com uma taxa fixa, indicado para proteção do poder de compra no longo prazo.'),

    ('CDB 110% CDI', 'CDB', 'MODERADO', 'MEDIO', 'MEDIO_PRAZO', 'MEDIO', 'BAIXA', 'CDI', 110.00, NULL, 500.00, 'CDI',
     'CDB com rentabilidade superior ao CDI, geralmente associado a prazos maiores.'),

    ('Fundo Imobiliário', 'FII', 'MODERADO', 'MEDIO', 'RENDA_MENSAL', 'LONGO', 'MEDIA', 'VARIAVEL', NULL, NULL, 100.00, 'HGLG11',
     'Fundo negociado em bolsa que pode gerar renda mensal por meio de rendimentos imobiliários.'),

    ('Ações brasileiras', 'ACAO', 'ARROJADO', 'ALTO', 'CRESCIMENTO_PATRIMONIAL', 'LONGO', 'ALTA', 'VARIAVEL', NULL, NULL, 100.00, 'PETR4',
     'Investimento em empresas listadas na bolsa, com maior risco e possibilidade de maior retorno no longo prazo.'),

    ('ETF de ações', 'ETF', 'ARROJADO', 'ALTO', 'CRESCIMENTO_PATRIMONIAL', 'LONGO', 'ALTA', 'VARIAVEL', NULL, NULL, 100.00, 'BOVA11',
     'Fundo negociado em bolsa que replica uma carteira de ações, permitindo diversificação com maior praticidade.');