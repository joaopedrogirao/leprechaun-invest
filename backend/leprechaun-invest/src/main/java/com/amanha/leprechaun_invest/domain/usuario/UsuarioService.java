package com.amanha.leprechaun_invest.domain.usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository.findByEmailIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }

    public Usuario cadastrarUsuario(CadastroDTO dados) {
        if (usuarioRepository.findByEmailIgnoreCase(dados.email()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        String senhaCripitografada = passwordEncoder.encode(dados.senha());

        Usuario usuario = new Usuario(dados, senhaCripitografada);
        return usuarioRepository.save(usuario);
    }


}
