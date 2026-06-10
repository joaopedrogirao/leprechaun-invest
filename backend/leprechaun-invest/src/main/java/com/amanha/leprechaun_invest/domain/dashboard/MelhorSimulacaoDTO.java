package com.amanha.leprechaun_invest.domain.dashboard;

import java.math.BigDecimal;

public record MelhorSimulacaoDTO(
        Long id,
        String nome,
        String investimento,
        BigDecimal valorFinal,
        BigDecimal totalInvestido,
        BigDecimal totalRendimento
) {
}
