package com.amanha.leprechaun_invest.domain.comparar;

import com.amanha.leprechaun_invest.domain.simulacao.ProjecaoMensal;
import com.amanha.leprechaun_invest.domain.simulacao.Simulacao;
import com.amanha.leprechaun_invest.domain.simulacao.SimulacaoRepository;
import com.amanha.leprechaun_invest.domain.usuario.Usuario;
import com.amanha.leprechaun_invest.infra.exception.RecursoNaoEncontradoException;
import com.amanha.leprechaun_invest.infra.exception.RegraDeNegocioException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class ComparacaoService {

    @Autowired
    private SimulacaoRepository simulacaoRepository;

    @Transactional(readOnly = true)
    public ComparacaoSimulacoesResponse comparar(CompararSimulacoesRequest request, Usuario usuario) {
        validarQuantidadeSimulacoes(request.simulacaoIds());

        List<Simulacao> simulacoes = request.simulacaoIds()
                .stream()
                .map(id -> buscarSimulacaoDoUsuario(id, usuario))
                .toList();

        List<CenarioComparadoDTO> cenarios = simulacoes.stream()
                .map(this::toCenarioComparadoDTO)
                .toList();

        List<SerieGraficoComparacaoDTO> grafico = simulacoes.stream()
                .map(this::toSerieGraficoComparacaoDTO)
                .toList();

        return new ComparacaoSimulacoesResponse(
                cenarios,
                grafico
        );
    }

    private void validarQuantidadeSimulacoes(List<Long> ids) {
        if (ids == null || ids.size() < 2 || ids.size() > 3) {
            throw new RegraDeNegocioException("Selecione de 2 a 3 simulações para comparar.");
        }

        if (ids.stream().distinct().count() != ids.size()) {
            throw new RegraDeNegocioException("Não é possível comparar a mesma simulação mais de uma vez.");
        }
    }

    private Simulacao buscarSimulacaoDoUsuario(Long id, Usuario usuario) {
        return simulacaoRepository
                .findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Simulação não encontrada."));
    }

    private CenarioComparadoDTO toCenarioComparadoDTO(Simulacao simulacao) {
        return new CenarioComparadoDTO(
                simulacao.getId(),
                simulacao.getNome(),
                simulacao.getInvestimento().getNome(),
                simulacao.getValorInicial(),
                simulacao.getAporteMensal(),
                simulacao.getPeriodoMeses(),
                simulacao.getTaxaAnualUsada(),
                simulacao.getTaxaMensalUsada(),
                simulacao.getValorFinal(),
                simulacao.getTotalInvestido(),
                simulacao.getTotalRendimento()
        );
    }

    private SerieGraficoComparacaoDTO toSerieGraficoComparacaoDTO(Simulacao simulacao) {
        List<PontoGraficoComparacaoDTO> pontos = simulacao.getProjecoesMensais()
                .stream()
                .sorted(Comparator.comparing(ProjecaoMensal::getMes))
                .map(projecao -> new PontoGraficoComparacaoDTO(
                        projecao.getMes(),
                        projecao.getSaldoFinal()
                ))
                .toList();

        return new SerieGraficoComparacaoDTO(
                simulacao.getId(),
                simulacao.getNome(),
                pontos
        );
    }
}
