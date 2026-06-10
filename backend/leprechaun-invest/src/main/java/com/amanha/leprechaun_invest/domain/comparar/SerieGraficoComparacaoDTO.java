package com.amanha.leprechaun_invest.domain.comparar;

import java.util.List;

public record SerieGraficoComparacaoDTO(
        Long simulacaoId,
        String nome,
        List<PontoGraficoComparacaoDTO> pontos
) {
}
