package com.amanha.leprechaun_invest.domain.dashboard;

import com.amanha.leprechaun_invest.domain.Investimento.Investimento;
import com.amanha.leprechaun_invest.domain.Investimento.InvestimentoRepository;
import com.amanha.leprechaun_invest.domain.simulacao.ProjecaoMensal;
import com.amanha.leprechaun_invest.domain.simulacao.Simulacao;
import com.amanha.leprechaun_invest.domain.simulacao.SimulacaoRepository;
import com.amanha.leprechaun_invest.domain.usuario.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private SimulacaoRepository simulacaoRepository;

    @Autowired
    private InvestimentoRepository investimentoRepository;

    @Transactional(readOnly = true)
    public DashboardDTO montarDashboard(Usuario usuario) {
        List<Simulacao> simulacoes = simulacaoRepository
                .findByUsuarioIdOrderByDataCriacaoDesc(usuario.getId());

        BigDecimal totalInvestido = simulacoes.stream()
                .map(Simulacao::getTotalInvestido)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal lucroAcumulado = simulacoes.stream()
                .map(Simulacao::getTotalRendimento)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal patrimonioProjetado = simulacoes.stream()
                .map(Simulacao::getValorFinal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal rentabilidadePercentual = BigDecimal.ZERO;

        if (totalInvestido.compareTo(BigDecimal.ZERO) > 0) {
            rentabilidadePercentual = lucroAcumulado
                    .multiply(BigDecimal.valueOf(100))
                    .divide(totalInvestido, 2, RoundingMode.HALF_UP);
        }

        Simulacao melhorSimulacao = simulacoes.stream()
                .max(Comparator.comparing(Simulacao::getValorFinal))
                .orElse(null);

        MelhorSimulacaoDTO melhorSimulacaoDTO = null;
        List<GraficoRendimentoDTO> grafico = List.of();

        if (melhorSimulacao != null) {
            melhorSimulacaoDTO = montarMelhorSimulacaoDTO(melhorSimulacao);
            grafico = montarGrafico(melhorSimulacao);
        }

        ResumoCarteiraDTO resumo = new ResumoCarteiraDTO(totalInvestido, lucroAcumulado, rentabilidadePercentual, patrimonioProjetado);

        List<RecomendacaoDashboardDTO> recomendacoes = montarRecomendacoes(usuario);

        return new DashboardDTO(
                resumo,
                recomendacoes,
                melhorSimulacaoDTO,
                grafico
        );
    }

    private MelhorSimulacaoDTO montarMelhorSimulacaoDTO(Simulacao simulacao) {
        return new MelhorSimulacaoDTO(
                simulacao.getId(),
                simulacao.getNome(),
                simulacao.getInvestimento().getNome(),
                simulacao.getValorFinal(),
                simulacao.getTotalInvestido(),
                simulacao.getTotalRendimento()
        );
    }

    private List<GraficoRendimentoDTO> montarGrafico(Simulacao simulacao) {
        return simulacao.getProjecoesMensais()
                .stream()
                .sorted(Comparator.comparing(ProjecaoMensal::getMes))
                .map(projecao -> {
                    BigDecimal valorInvestido = simulacao.getValorInicial()
                            .add(simulacao.getAporteMensal()
                                    .multiply(BigDecimal.valueOf(projecao.getMes())));

                    return new GraficoRendimentoDTO(
                            projecao.getMes(),
                            valorInvestido,
                            projecao.getSaldoFinal()
                    );
                })
                .toList();
    }

    private List<RecomendacaoDashboardDTO> montarRecomendacoes(Usuario usuario) {

        if (usuario.getPerfilInvestidor() == null) {
            return List.of();
        }

        return investimentoRepository
                .findByPerfilRecomendado(usuario.getPerfilInvestidor())
                .stream()
                .map(investimento -> new RecomendacaoDashboardDTO(
                        investimento.getNome(),
                        investimento.getNivelRisco().name(),
                        montarTextoRentabilidade(investimento)
                ))
                .toList();

    }

    private String montarTextoRentabilidade(Investimento investimento) {
        if (investimento.getPercentualIndexador() != null) {
            return investimento.getPercentualIndexador() + "% " + investimento.getIndexador();
        }

        if (investimento.getTaxaFixaAnual() != null) {
            return investimento.getIndexador() + " + " + investimento.getTaxaFixaAnual() + "% a.a";
        }

        return "Variável";
    }
}
