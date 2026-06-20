package com.amanha.leprechaun_invest.controller;

import com.amanha.leprechaun_invest.domain.dashboard.DashboardDTO;
import com.amanha.leprechaun_invest.domain.dashboard.DashboardService;
import com.amanha.leprechaun_invest.domain.usuario.Usuario;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    private final UsuarioService usuarioService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> buscarDashboard(Authentication authentication) {
        Usuario usuario = usuarioService.buscarUsuarioLogado(authentication);

        return ResponseEntity.ok(dashboardService.montarDashboard(usuario));
    }
}
