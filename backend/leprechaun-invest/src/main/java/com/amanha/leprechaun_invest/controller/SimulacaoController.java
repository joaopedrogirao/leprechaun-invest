package com.amanha.leprechaun_invest.controller;

import com.amanha.leprechaun_invest.domain.simulacao.SimulacaoRequest;
import com.amanha.leprechaun_invest.domain.simulacao.SimulacaoResponse;
import com.amanha.leprechaun_invest.domain.simulacao.SimulacaoService;
import com.amanha.leprechaun_invest.domain.usuario.Usuario;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/simulacao")
@RequiredArgsConstructor
public class SimulacaoController {

    private final SimulacaoService simulacaoService;

    private final UsuarioService usuarioService;

    @PostMapping("/calcular")
    public SimulacaoResponse calcular(@RequestBody SimulacaoRequest request, Authentication authentication) {
        Usuario usuario = usuarioService.buscarUsuarioLogado(authentication);
        return simulacaoService.calcular(request, usuario);
    }
}

