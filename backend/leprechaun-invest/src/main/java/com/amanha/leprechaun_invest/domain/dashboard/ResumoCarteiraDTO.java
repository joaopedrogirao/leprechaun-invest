package com.amanha.leprechaun_invest.domain.dashboard;

import java.math.BigDecimal;

public record ResumoCarteiraDTO(
        BigDecimal totalInvestido,
        BigDecimal lucroAcumulado,
        BigDecimal rentabilidadePercentual,
        BigDecimal patrimonioProjetado
) {
}
