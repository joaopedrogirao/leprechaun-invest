package com.amanha.leprechaun_invest.domain.dashboard;

import java.util.List;

public record DashboardDTO(
        ResumoCarteiraDTO resumoCarteira,
        List<RecomendacaoDashboardDTO> recomendacoesPersonalizadas,
        MelhorSimulacaoDTO melhorSimulacao,
        List<GraficoRendimentoDTO> graficoRendimentos
) {

}
