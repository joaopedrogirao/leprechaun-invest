package com.amanha.leprechaun_invest.domain.simulacao;

import com.amanha.leprechaun_invest.domain.Investimento.NivelRisco;
import com.amanha.leprechaun_invest.domain.Investimento.ObjetivoInvestimento;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record SimulacaoRequest(
        @NotNull
        @DecimalMin(value = "0.01")
        BigDecimal valorInicial,

        @NotNull
        @DecimalMin(value = "0.00")
        BigDecimal aporteMensal,

        @NotNull
        @Min(1)
        @Max(600)
        Integer periodoMeses,

        @NotNull
        ObjetivoInvestimento objetivo,

        @NotNull
        NivelRisco nivelRiscoDesejado
) {
}
