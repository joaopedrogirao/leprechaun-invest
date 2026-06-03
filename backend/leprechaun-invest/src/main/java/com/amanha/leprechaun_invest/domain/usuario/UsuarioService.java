package com.amanha.leprechaun_invest.domain.usuario;

import com.amanha.leprechaun_invest.domain.QuizPerfilDoUsuario.QuizPerfilUsuarioDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
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

    @Transactional
    public void cadastrarUsuario(CadastroDTO dados) {
        if (usuarioRepository.findByEmailIgnoreCase(dados.email()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        String senhaCripitografada = passwordEncoder.encode(dados.senha());
        Usuario usuario = new Usuario(dados, senhaCripitografada);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public UsuarioDTO definirPerfilInvestidor(Long idUsuario, QuizPerfilUsuarioDTO dados){
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("usuario não encontrado"));

        int pontuacao = dados.respostas()
                .stream()
                .mapToInt(Integer::intValue)
                .sum();

        PerfilInvestidor perfil;

        if (pontuacao <= 6){
            perfil = PerfilInvestidor.CONSERVADOR;
        }else if (pontuacao <= 10){
            perfil = PerfilInvestidor.MODERADO;
        } else {
            perfil = PerfilInvestidor.ARROJADO;
        }

        usuario.definirPerfilInvestidor(perfil);

        return new UsuarioDTO(usuario);
    }


    public Usuario buscarUsuarioLogado(Authentication authentication) {
        String email = authentication.getName();

        return usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Usuário logado não encontrado"));
    }
}
