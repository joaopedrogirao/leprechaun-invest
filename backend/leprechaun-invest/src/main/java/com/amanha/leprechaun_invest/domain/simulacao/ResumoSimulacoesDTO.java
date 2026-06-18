package com.amanha.leprechaun_invest.domain.simulacao;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ResumoSimulacoesDTO(
        Long totalSimulacoesSalvas,
        BigDecimal melhorProjecao,
        BigDecimal rentabilidadeMediaTotal,
        LocalDateTime ultimaSimulacao
) {
}
