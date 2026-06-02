package com.amanha.leprechaun_invest.domain.Investimento;

import java.math.BigDecimal;

public record InvestimentoDTO(
        Long id,
        String nome,
        String tipo,
        String perfilRecomendado,
        String nivelRisco,
        String objetivoRecomendado,
        String horizonteRecomendado,
        String liquidez,
        String indexador,
        BigDecimal valorMinimo,
        String descricao
) {
}
