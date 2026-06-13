package com.amanha.leprechaun_invest.domain.simulacao;

import java.math.BigDecimal;

public record SimulacaoResumoDTO(
        BigDecimal valorInicial,
        BigDecimal aporteMensal,
        Integer periodoMeses,
        BigDecimal taxaMensalUsada,
        BigDecimal valorFinal,
        BigDecimal totalInvestido,
        BigDecimal totalRendimento
) {
}
