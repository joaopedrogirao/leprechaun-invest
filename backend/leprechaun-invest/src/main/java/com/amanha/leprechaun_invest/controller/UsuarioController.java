package com.amanha.leprechaun_invest.controller;

import com.amanha.leprechaun_invest.domain.QuizPerfilDoUsuario.QuizPerfilUsuarioDTO;
import com.amanha.leprechaun_invest.domain.usuario.CadastroDTO;
import com.amanha.leprechaun_invest.domain.usuario.Usuario;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioDTO;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioRepository;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;
    private final UsuarioRepository repository;

    @PostMapping
    public ResponseEntity cadastrarUsuario(@RequestBody @Valid CadastroDTO dados) {
        usuarioService.cadastrarUsuario(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario cadastrado com sucesso");
    }

    @PostMapping("me/perfil-investidor")
    public ResponseEntity<UsuarioDTO> definirPerfilInvestidor(@AuthenticationPrincipal Usuario usuarioLogado, @RequestBody @Valid QuizPerfilUsuarioDTO dados) {

        UsuarioDTO usuarioAtualizado = usuarioService.definirPerfilInvestidor(usuarioLogado.getId(), dados);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> buscarPerfilLogado(Principal principal) {
        Usuario usuarioLogado = repository.findByEmailIgnoreCase(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));
                
        return ResponseEntity.ok(new UsuarioDTO(usuarioLogado));
    }
}