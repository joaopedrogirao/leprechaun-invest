package com.amanha.leprechaun_invest.domain.usuario;
import jakarta.validation.constraints.NotBlank;

public record NovaSenhaDTO(@NotBlank String token, 
                           @NotBlank String novaSenha) {

}