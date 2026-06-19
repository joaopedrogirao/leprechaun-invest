package com.amanha.leprechaun_invest.domain.simulacao;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SimulacaoListagemDTO(
        Long id,
        String nome,
        String investimento,
        BigDecimal valorInicial,
        BigDecimal aporteMensal,
        Integer periodoMeses,
        BigDecimal taxaAnualUsada,
        BigDecimal valorFinal,
        BigDecimal totalRendimento,
        LocalDateTime dataCriacao
) {
}
