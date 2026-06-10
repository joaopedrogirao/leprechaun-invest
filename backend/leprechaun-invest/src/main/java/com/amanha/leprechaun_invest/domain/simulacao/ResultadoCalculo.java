package com.amanha.leprechaun_invest.domain.simulacao;

import com.amanha.leprechaun_invest.domain.Investimento.HorizonteInvestimento;
import com.amanha.leprechaun_invest.domain.Investimento.Investimento;

import java.math.BigDecimal;

public record ResultadoCalculo(
        Investimento investimento,
        HorizonteInvestimento horizonte,
        BigDecimal taxaAnual,
        BigDecimal taxaMensal,
        SimulacaoResponse response
) {
}
