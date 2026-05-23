package com.amanha.leprechaun_invest.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import com.amanha.leprechaun_invest.domain.usuario.UsuarioRepository;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioService;

import jakarta.validation.Valid;

import com.amanha.leprechaun_invest.domain.usuario.CadastroDTO;
import com.amanha.leprechaun_invest.domain.usuario.UsuarioDTO;
import com.amanha.leprechaun_invest.domain.usuario.Usuario;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController
{
    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private UsuarioService service;

    @PostMapping
    public ResponseEntity<UsuarioDTO> cadastrar(@RequestBody @Valid CadastroDTO dados, UriComponentsBuilder uriBuilder)
    {
        Usuario usuarioSalvo = service.cadastrarUsuario(dados);

        var uri = uriBuilder.path("/usuarios/{id}").buildAndExpand(usuarioSalvo.getId()).toUri();

        return ResponseEntity.created(uri).body(new UsuarioDTO(usuarioSalvo));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listar()
    {
        var listaDTO = repository.findAll().stream().map(UsuarioDTO::new).toList();
        return ResponseEntity.ok(listaDTO);
    }
}