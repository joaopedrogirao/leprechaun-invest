package com.amanha.leprechaun_invest.domain.comparar;

import java.util.List;

public record ComparacaoSimulacoesResponse(
        List<CenarioComparadoDTO> cenarios,
        List<SerieGraficoComparacaoDTO> grafico
) {
}
