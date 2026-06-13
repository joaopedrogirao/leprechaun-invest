package com.amanha.leprechaun_invest.controller;

import com.amanha.leprechaun_invest.domain.QuizPerfilDoUsuario.QuizPerfilUsuarioDTO;
import com.amanha.leprechaun_invest.domain.usuario.CadastroDTO;
import com.amanha.leprechaun_invest.domain.usuario.EmailRecuperacaoDTO;
import com.amanha.leprechaun_invest.domain.usuario.NovaSenhaDTO;
import com.amanha.leprechaun_invest.domain.usuario.Usuario;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioDTO;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioRepository;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<?> cadastrarUsuario(@RequestBody @Valid CadastroDTO dados) {
        usuarioService.cadastrarUsuario(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuário cadastrado com sucesso!");
    }

    @PostMapping("/me/perfil-investidor")
    public ResponseEntity<UsuarioDTO> definirPerfilInvestidor(Principal principal, @RequestBody @Valid QuizPerfilUsuarioDTO dados) 
    {
        Usuario usuarioLogado = usuarioRepository.findByEmailIgnoreCase(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        UsuarioDTO usuarioAtualizado = usuarioService.definirPerfilInvestidor(usuarioLogado.getId(), dados);
        
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> buscarPerfilLogado(Principal principal) {
        Usuario usuarioLogado = usuarioRepository.findByEmailIgnoreCase(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));
                
        return ResponseEntity.ok(new UsuarioDTO(usuarioLogado));
    }

    @PostMapping("/esqueci-minha-senha")
    public ResponseEntity<?> solicitarRecuperacao(@RequestBody @Valid EmailRecuperacaoDTO dados) {
        usuarioService.solicitarRecuperacaoSenha(dados.email());
        return ResponseEntity.ok("Se o e-mail existir, um token de recuperação será enviado.");
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody @Valid NovaSenhaDTO dados) {
        usuarioService.redefinirSenha(dados.token(), dados.novaSenha());
        return ResponseEntity.ok("Senha atualizada com sucesso!");
    }
}