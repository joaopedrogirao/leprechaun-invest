package com.amanha.leprechaun_invest.domain.comparar;

import java.math.BigDecimal;

public record CenarioComparadoDTO(
        Long id,
        String nome,
        String investimento,
        BigDecimal valorInicial,
        BigDecimal aporteMensal,
        Integer periodoMeses,
        BigDecimal taxaAnualUsada,
        BigDecimal taxaMensalUsada,
        BigDecimal valorFinal,
        BigDecimal totalInvestido,
        BigDecimal totalRendimento
) {
}
