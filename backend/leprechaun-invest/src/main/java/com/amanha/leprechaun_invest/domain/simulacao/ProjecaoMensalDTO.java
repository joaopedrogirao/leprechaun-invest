package com.amanha.leprechaun_invest.domain.simulacao;

import java.math.BigDecimal;

public record ProjecaoMensalDTO(
        Integer mes,
        BigDecimal saldoInicial,
        BigDecimal aporte,
        BigDecimal rendimento,
        BigDecimal saldoFinal
) {
}
