package com.amanha.leprechaun_invest.controller;

import com.amanha.leprechaun_invest.domain.Investimento.InvestimentoDTO;
import com.amanha.leprechaun_invest.domain.Investimento.InvestimentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/investimentos")
@RequiredArgsConstructor
public class InvestimentoController {

    private final InvestimentoService service;

    @GetMapping
    public ResponseEntity<List<InvestimentoDTO>> ListarTodos(){
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvestimentoDTO> buscarPorId(@PathVariable long id){
        return ResponseEntity.ok(service.buscarPorId(id));
    }
    
}
