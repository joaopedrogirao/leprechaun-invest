package com.amanha.leprechaun_invest.domain.dashboard;

import java.math.BigDecimal;

public record GraficoRendimentoDTO(
        Integer mes,
        BigDecimal valorInvestido,
        BigDecimal valorProjetado
) {
}
