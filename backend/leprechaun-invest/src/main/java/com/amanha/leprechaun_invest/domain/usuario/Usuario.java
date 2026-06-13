package com.amanha.leprechaun_invest.domain.usuario;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Table(name = "usuario")
@Entity(name = "usuario")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String nome;
    private String senha;
    private String tokenRecuperacao;
    private LocalDateTime expiracaoToken;

    public Usuario(CadastroDTO dados, String senhaCripitografada) {
        this.nome = dados.nome();
        this.email = dados.email();
        this.senha = senhaCripitografada;
    }

    @Enumerated(EnumType.STRING)
    private PerfilInvestidor perfilInvestidor;

    public void definirPerfilInvestidor(PerfilInvestidor perfil) {
        this.perfilInvestidor = perfil;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return email;
    }

    public void criarTokenRecuperacao(String token, LocalDateTime expiracao) {
        this.tokenRecuperacao = token;
        this.expiracaoToken = expiracao;
    }

    public void atualizarSenha(String novaSenhaCriptografada) {
        this.senha = novaSenhaCriptografada;
        this.tokenRecuperacao = null;
        this.expiracaoToken = null;
    }
}