package com.amanha.leprechaun_invest.domain.simulacao;

import com.amanha.leprechaun_invest.domain.Investimento.NivelRisco;
import com.amanha.leprechaun_invest.domain.Investimento.ObjetivoInvestimento;

import java.math.BigDecimal;

public record SimulacaoSalvarRequest(
        String nome,
        BigDecimal valorInicial,
        BigDecimal aporteMensal,
        Integer periodoMeses,
        ObjetivoInvestimento objetivo,
        NivelRisco nivelRiscoDesejado
) {
}
