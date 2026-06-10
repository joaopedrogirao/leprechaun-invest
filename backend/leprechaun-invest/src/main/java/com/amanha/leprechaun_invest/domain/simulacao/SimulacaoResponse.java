package com.amanha.leprechaun_invest.domain.simulacao;

import java.util.List;

public record SimulacaoResponse(
        InvestimentoRecomendadoDTO investimentoRecomendado,
        SimulacaoResumoDTO resumo,
        List<ProjecaoMensalDTO> projecaoMensal
) {
}
