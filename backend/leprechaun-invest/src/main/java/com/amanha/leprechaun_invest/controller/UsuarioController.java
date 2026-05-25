package com.amanha.leprechaun_invest.controller;

import com.amanha.leprechaun_invest.domain.usuario.CadastroDTO;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity cadastrarUsuario(@RequestBody @Valid CadastroDTO dados) {
        usuarioService.cadastrarUsuario(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario cadastrado com sucesso");
    }

}
