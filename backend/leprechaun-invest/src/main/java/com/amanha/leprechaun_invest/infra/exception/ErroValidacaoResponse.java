package com.amanha.leprechaun_invest.infra.exception;

public record ErroValidacaoResponse(
        String campo,
        String mensagem
) {
}
