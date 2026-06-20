package com.amanha.leprechaun_invest.domain.Investimento;

import com.amanha.leprechaun_invest.infra.exception.RecursoNaoEncontradoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InvestimentoService {

    @Autowired
    private InvestimentoRepository investimentoRepository;

    @Transactional(readOnly = true)
    public List<InvestimentoDTO> listarTodos(){
        return investimentoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public InvestimentoDTO buscarPorId(long id){
        Investimento investimento = investimentoRepository.findById(id).orElseThrow(()-> new RecursoNaoEncontradoException("investimento não encontrado"));

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
