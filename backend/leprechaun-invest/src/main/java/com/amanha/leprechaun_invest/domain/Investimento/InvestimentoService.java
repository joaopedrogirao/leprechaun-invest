package com.amanha.leprechaun_invest.domain.Investimento;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvestimentoService {

    @Autowired
    private InvestimentoRepository investimentoRepository;

    public List<InvestimentoDTO> listarTodos(){
        return investimentoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public InvestimentoDTO buscarPorId(long id){
        Investimento investimento = investimentoRepository.findById(id).orElseThrow(()-> new RuntimeException("investimento não encontrado"));

        return toResponse(investimento);
    }

    private InvestimentoDTO toResponse(Investimento investimento) {
        return new InvestimentoDTO(
                investimento.getId(),
                investimento.getNome(),
                investimento.getTipo().name(),
                investimento.getPerfilRecomendado().name(),
                investimento.getNivelRisco().name(),
                investimento.getObjetivoRecomendado().name(),
                investimento.getHorizonteRecomendado().name(),
                investimento.getLiquidez().name(),
                investimento.getIndexador().name(),
                investimento.getValorMinimo(),
                investimento.getDescricao()
        );
    }

}
