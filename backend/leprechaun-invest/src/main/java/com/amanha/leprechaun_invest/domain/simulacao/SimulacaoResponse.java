package com.amanha.leprechaun_invest.domain.simulacao;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record SimulacaoResponse(
        Long id,
        String nome,
        String objetivo,
        String nivelRiscoDesejado,
        String horizonte,
        BigDecimal taxaAnualUsada,
        LocalDateTime dataCriacao,
        InvestimentoRecomendadoDTO investimentoRecomendado,
        SimulacaoResumoDTO resumo,
        List<ProjecaoMensalDTO> projecaoMensal
) {
}
