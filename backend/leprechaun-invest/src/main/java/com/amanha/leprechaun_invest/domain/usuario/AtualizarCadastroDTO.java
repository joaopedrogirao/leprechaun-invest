package com.amanha.leprechaun_invest.domain.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AtualizarCadastroDTO(@NotBlank String nome,
                                   @NotBlank @Email String email) {
}