package com.amanha.leprechaun_invest.domain.QuizPerfilDoUsuario;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record QuizPerfilUsuarioDTO(@NotEmpty List<Integer> respostas) {
}
