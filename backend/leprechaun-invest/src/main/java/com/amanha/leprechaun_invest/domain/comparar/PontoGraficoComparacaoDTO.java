package com.amanha.leprechaun_invest.domain.comparar;

import java.math.BigDecimal;

public record PontoGraficoComparacaoDTO(
        Integer mes,
        BigDecimal saldoFinal
) {
}
