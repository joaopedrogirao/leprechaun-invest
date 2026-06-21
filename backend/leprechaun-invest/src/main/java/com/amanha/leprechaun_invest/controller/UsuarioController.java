package com.amanha.leprechaun_invest.controller;

import com.amanha.leprechaun_invest.domain.QuizPerfilDoUsuario.QuizPerfilUsuarioDTO;
import com.amanha.leprechaun_invest.domain.simulacao.MensagemResponse;
import com.amanha.leprechaun_invest.domain.usuario.AtualizarCadastroDTO;
import com.amanha.leprechaun_invest.domain.usuario.CadastroDTO;
import com.amanha.leprechaun_invest.domain.usuario.EmailRecuperacaoDTO;
import com.amanha.leprechaun_invest.domain.usuario.NovaSenhaDTO;
import com.amanha.leprechaun_invest.domain.usuario.Usuario;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioDTO;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController
{
    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<MensagemResponse> cadastrarUsuario(@RequestBody @Valid CadastroDTO dados) {
        usuarioService.cadastrarUsuario(dados);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new MensagemResponse("Usuário cadastrado com sucesso!"));
    }

    @PostMapping("/me/perfil-investidor")
    public ResponseEntity<UsuarioDTO> definirPerfilInvestidor(Authentication authentication, @RequestBody @Valid QuizPerfilUsuarioDTO dados)
    {
        Usuario usuarioLogado = usuarioService.buscarUsuarioLogado(authentication);
        
        UsuarioDTO usuarioAtualizado = usuarioService.definirPerfilInvestidor(usuarioLogado.getId(), dados);
        
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioDTO> atualizarUsuario(Authentication authentication, @RequestBody @Valid AtualizarCadastroDTO dados)
    {
        Usuario usuarioLogado = usuarioService.buscarUsuarioLogado(authentication);
        
        UsuarioDTO usuarioAtualizado = usuarioService.atualizarUsuario(usuarioLogado.getId(), dados);
        
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @PutMapping("/me/perfil-investidor")
    public ResponseEntity<UsuarioDTO> refazerPerfilInvestidor(Authentication authentication, @RequestBody @Valid QuizPerfilUsuarioDTO dados)
    {
        Usuario usuarioLogado = usuarioService.buscarUsuarioLogado(authentication);
        
        UsuarioDTO usuarioAtualizado = usuarioService.definirPerfilInvestidor(usuarioLogado.getId(), dados);
        
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> buscarPerfilLogado(Authentication authentication)
    {
        Usuario usuarioLogado = usuarioService.buscarUsuarioLogado(authentication);
        
        return ResponseEntity.ok(new UsuarioDTO(usuarioLogado));
    }

    @PostMapping("/esqueci-minha-senha")
    public ResponseEntity<MensagemResponse> solicitarRecuperacao(@RequestBody @Valid EmailRecuperacaoDTO dados) {
        usuarioService.solicitarRecuperacaoSenha(dados.email());

        return ResponseEntity.ok(new MensagemResponse("Se o e-mail existir, um token de recuperação será enviado."));
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<MensagemResponse> redefinirSenha(@RequestBody @Valid NovaSenhaDTO dados) {
        usuarioService.redefinirSenha(dados.token(), dados.novaSenha());
        return ResponseEntity.ok(new MensagemResponse("Senha atualizada com sucesso!"));
    }
}