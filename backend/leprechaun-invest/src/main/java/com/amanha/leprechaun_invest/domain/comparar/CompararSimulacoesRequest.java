package com.amanha.leprechaun_invest.domain.comparar;

import java.util.List;

public record CompararSimulacoesRequest(
        List<Long> simulacaoIds
) {
}
