package com.amanha.leprechaun_invest.controller;

import com.amanha.leprechaun_invest.domain.dashboard.DashboardDTO;
import com.amanha.leprechaun_invest.domain.dashboard.DashboardService;
import com.amanha.leprechaun_invest.domain.usuario.Usuario;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequiredArgsConstructor
public class DashboardController {

    @Autowired
    private final DashboardService dashboardService;

    @Autowired
    private final UsuarioService usuarioService;

    @GetMapping("/dashboard")
    public DashboardDTO buscarDashboard(Authentication authentication) {
        Usuario usuario = usuarioService.buscarUsuarioLogado(authentication);

        return dashboardService.montarDashboard(usuario);
    }
}
