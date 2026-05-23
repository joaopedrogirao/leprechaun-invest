package com.amanha.leprechaun_invest.domain.usuario;

public record UsuarioDTO(
    Long id,
    String nome,
    String email,
    PerfilInvestidor perfilInvestidor
)

{
    public UsuarioDTO(Usuario usuario) {
        this(
            usuario.getId(), 
            usuario.getNome(), 
            usuario.getEmail(), 
            usuario.getPerfilInvestidor()
        );
    }
}