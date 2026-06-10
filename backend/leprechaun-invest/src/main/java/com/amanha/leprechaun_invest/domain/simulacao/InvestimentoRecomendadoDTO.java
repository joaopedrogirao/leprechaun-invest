package com.amanha.leprechaun_invest.domain.simulacao;

public record InvestimentoRecomendadoDTO(
        Long id,
        String nome,
        String tipo,
        String nivelRisco,
        String perfilRecomendado,
        String motivoRecomendacao
) {
}
