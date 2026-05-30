package com.amanha.leprechaun_invest.controller;

import com.amanha.leprechaun_invest.domain.Investimento.InvestimentoDTO;
import com.amanha.leprechaun_invest.domain.Investimento.InvestimentoService;
import lombok.RequiredArgsConstructor;
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
    public List<InvestimentoDTO> ListarTodos(){
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public InvestimentoDTO buscarPorId(@PathVariable long id){
        return service.buscarPorId(id);
    }
    
}
