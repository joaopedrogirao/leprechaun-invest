package com.amanha.leprechaun_invest.controller;

import com.amanha.leprechaun_invest.domain.comparar.ComparacaoService;
import com.amanha.leprechaun_invest.domain.comparar.ComparacaoSimulacoesResponse;
import com.amanha.leprechaun_invest.domain.comparar.CompararSimulacoesRequest;
import com.amanha.leprechaun_invest.domain.simulacao.*;
import com.amanha.leprechaun_invest.domain.usuario.Usuario;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    private final ComparacaoService comparacaoService;

    @PostMapping("/calcular")
    public ResponseEntity<SimulacaoResponse> calcular(@Valid @RequestBody SimulacaoRequest request, Authentication authentication) {
        Usuario usuario = usuarioService.buscarUsuarioLogado(authentication);
        return ResponseEntity.ok(simulacaoService.calcular(request, usuario));
    }

    @PostMapping
    public ResponseEntity<SimulacaoResponse> salvar(@Valid @RequestBody SimulacaoSalvarRequest request, Authentication authentication) {
        Usuario usuario = usuarioService.buscarUsuarioLogado(authentication);

        return ResponseEntity.status(HttpStatus.CREATED).body(simulacaoService.salvar(request, usuario));
    }

    @PostMapping("/comparar")
    public ResponseEntity<ComparacaoSimulacoesResponse> comparar(@RequestBody CompararSimulacoesRequest request, Authentication authentication) {
        Usuario usuario = usuarioService.buscarUsuarioLogado(authentication);

        return ResponseEntity.ok(comparacaoService.comparar(request, usuario));
    }

    @GetMapping
    public ResponseEntity<List<SimulacaoListagemDTO>> listar(Authentication authentication) {
        Usuario usuario = usuarioService.buscarUsuarioLogado(authentication);

        return ResponseEntity.ok(simulacaoService.listarDoUsuario(usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id, Authentication authentication){
        Usuario usuario = usuarioService.buscarUsuarioLogado(authentication);
        simulacaoService.deletar(id, usuario);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SimulacaoResponse> buscarDetalhes(@PathVariable Long id, Authentication authentication) {
        Usuario usuario = usuarioService.buscarUsuarioLogado(authentication);

        return ResponseEntity.ok(simulacaoService.buscarDetalhes(id, usuario));
    }

    @GetMapping("/resumo")
    public ResponseEntity<ResumoSimulacoesDTO> buscarResumoSimulacoes(Authentication authentication) {
        Usuario usuario = usuarioService.buscarUsuarioLogado(authentication);
        return ResponseEntity.ok(simulacaoService.buscarResumo(usuario));
    }
}

