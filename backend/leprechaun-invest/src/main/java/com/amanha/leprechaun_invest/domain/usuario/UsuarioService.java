package com.amanha.leprechaun_invest.domain.usuario;

import com.amanha.leprechaun_invest.domain.QuizPerfilDoUsuario.QuizPerfilUsuarioDTO;
import com.amanha.leprechaun_invest.infra.exception.RecursoNaoEncontradoException;
import com.amanha.leprechaun_invest.infra.exception.RegraDeNegocioException;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository.findByEmailIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }

    @Transactional
    public void cadastrarUsuario(CadastroDTO dados) {
        if (usuarioRepository.findByEmailIgnoreCase(dados.email()).isPresent()) {
            throw new RegraDeNegocioException("Email já cadastrado!");
        }

        String senhaCripitografada = passwordEncoder.encode(dados.senha());
        Usuario usuario = new Usuario(dados, senhaCripitografada);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public UsuarioDTO definirPerfilInvestidor(Long idUsuario, QuizPerfilUsuarioDTO dados){
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado!"));

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

    @Transactional
    public UsuarioDTO atualizarUsuario(Long idUsuario, AtualizarCadastroDTO dados) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado!"));

        if (!usuario.getEmail().equalsIgnoreCase(dados.email()) && 
            usuarioRepository.findByEmailIgnoreCase(dados.email()).isPresent()) {
            throw new RegraDeNegocioException("Email já cadastrado!");
        }

        usuario.setNome(dados.nome());
        usuario.setEmail(dados.email());

        return new UsuarioDTO(usuario);
    }

    @Transactional
    public void solicitarRecuperacaoSenha(String email) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado!"));

        String token = UUID.randomUUID().toString();
        LocalDateTime expiracao = LocalDateTime.now().plusMinutes(30);

        usuario.criarTokenRecuperacao(token, expiracao);

        enviarEmailRecuperacao(usuario.getEmail(), token);
    }

    @Transactional
    public void redefinirSenha(String token, String novaSenha) {
        Usuario usuario = usuarioRepository.findByTokenRecuperacao(token)
                .orElseThrow(() -> new RegraDeNegocioException("Token inválido ou não encontrado!"));

        if (usuario.getExpiracaoToken().isBefore(LocalDateTime.now())) {
            throw new RegraDeNegocioException("O token expirou. Solicite a recuperação novamente.");
        }

        String senhaCriptografada = passwordEncoder.encode(novaSenha);
        usuario.atualizarSenha(senhaCriptografada);
    }

    @Transactional(readOnly = true)
    public Usuario buscarUsuarioLogado(Authentication authentication) {
        String email = authentication.getName();

        return usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário logado não encontrado!"));
    }

    private void enviarEmailRecuperacao(String emailDestino, String token) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        
        mensagem.setFrom("nao-responda@leprechauninvest.com");
        mensagem.setTo(emailDestino);
        mensagem.setSubject("Leprechaun Invest - Recuperação de Senha");
        
        String corpoEmail = "Olá!\n\n" +
                "Você solicitou a recuperação de senha para a sua conta no Leprechaun Invest.\n" +
                "Use o token abaixo para redefinir sua senha (válido por 30 minutos):\n\n" +
                token + "\n\n" +
                "Se você não solicitou essa alteração, ignore este e-mail.";
                
        mensagem.setText(corpoEmail);

        mailSender.send(mensagem);
    }
}
