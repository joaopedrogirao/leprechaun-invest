package com.amanha.leprechaun_invest.controller;

import com.amanha.leprechaun_invest.domain.simulacao.*;
import com.amanha.leprechaun_invest.domain.usuario.Usuario;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/simulacao")
@RequiredArgsConstructor
public class SimulacaoController {

    private final SimulacaoService simulacaoService;

    private final UsuarioService usuarioService;

    @PostMapping("/calcular")
    public SimulacaoResponse calcular(@Valid @RequestBody SimulacaoRequest request, Authentication authentication) {
        Usuario usuario = usuarioService.buscarUsuarioLogado(authentication);
        return simulacaoService.calcular(request, usuario);
    }

    @PostMapping
    public SimulacaoResponse salvar(@Valid @RequestBody SimulacaoSalvarRequest request, Authentication authentication) {
        Usuario usuario = usuarioService.buscarUsuarioLogado(authentication);

        return simulacaoService.salvar(request, usuario);
    }

    @GetMapping
    public List<SimulacaoListagemDTO> listar(Authentication authentication) {
        Usuario usuario = usuarioService.buscarUsuarioLogado(authentication);

        return simulacaoService.listarDoUsuario(usuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id, Authentication authentication){
        Usuario usuario = usuarioService.buscarUsuarioLogado(authentication);
        simulacaoService.deletar(id, usuario);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public SimulacaoResponse buscarDetalhes(@PathVariable Long id, Authentication authentication) {
        Usuario usuario = usuarioService.buscarUsuarioLogado(authentication);

        return simulacaoService.buscarDetalhes(id, usuario);
    }
}

