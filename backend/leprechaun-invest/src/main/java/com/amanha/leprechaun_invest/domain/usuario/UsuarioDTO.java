package com.amanha.leprechaun_invest.domain.usuario;

public record UsuarioDTO(Long id,
                         String nome,
                         String email,
                         PerfilInvestidor perfilInvestidor) {

    public UsuarioDTO(Usuario dados){
        this(dados.getId(), dados.getNome(), dados.getEmail(), dados.getPerfilInvestidor());
    }
}
