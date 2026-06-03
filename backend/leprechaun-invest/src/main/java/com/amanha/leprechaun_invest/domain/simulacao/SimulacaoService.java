package com.amanha.leprechaun_invest.domain.simulacao;

import com.amanha.leprechaun_invest.domain.Investimento.*;
import com.amanha.leprechaun_invest.domain.usuario.PerfilInvestidor;
import com.amanha.leprechaun_invest.domain.usuario.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class SimulacaoService {

    @Autowired
    private InvestimentoRepository investimentoRepository;

    public SimulacaoResponse calcular(@RequestBody SimulacaoRequest request, Usuario usuario) {

        PerfilInvestidor perfilUsuario = usuario.getPerfilInvestidor();

        HorizonteInvestimento horizonte = converterPeriodoParaHorizonte(request.periodoMeses());

        Investimento investimentoRecomendado = recomendarInvestimento(perfilUsuario, request, horizonte);

        BigDecimal taxaAnual = buscarTaxaAnualTemporaria(investimentoRecomendado);
        BigDecimal taxaMensal = converterTaxaAnualParaMensal(taxaAnual);

        List<ProjecaoMensalDTO> projecoes = calcularProjecaoMensal(request.valorInicial(), request.aporteMensal(), request.periodoMeses(), taxaMensal);

        BigDecimal valorFinal = projecoes.getLast().saldoFinal();

        BigDecimal totalInvestido = request.valorInicial()
                .add(request.aporteMensal().multiply(BigDecimal.valueOf(request.periodoMeses())));

        BigDecimal totalRendimento = valorFinal.subtract(totalInvestido);

        InvestimentoRecomendadoDTO investimentoDTO = new InvestimentoRecomendadoDTO(
                investimentoRecomendado.getId(),
                investimentoRecomendado.getNome(),
                investimentoRecomendado.getTipo().name(),
                investimentoRecomendado.getNivelRisco().name(),
                investimentoRecomendado.getPerfilRecomendado().name(),
                gerarMotivoRecomendacao(investimentoRecomendado, usuario.getPerfilInvestidor(), request, horizonte)
        );

        SimulacaoResumoDTO resumo = new SimulacaoResumoDTO(
                request.valorInicial(),
                request.aporteMensal(),
                request.periodoMeses(),
                taxaMensal,
                valorFinal,
                totalInvestido,
                totalRendimento
        );

        return new SimulacaoResponse(
                investimentoDTO,
                resumo,
                projecoes
        );
    }

    private Investimento recomendarInvestimento(PerfilInvestidor perfilUsuario, SimulacaoRequest request, HorizonteInvestimento horizonte) {
        return investimentoRepository.findAll()
                .stream()
                .filter(investimento -> possuiValorMinimo(investimento, request.valorInicial()))
                .filter(investimento -> riscoPermitido(investimento.getNivelRisco(), request.nivelRiscoDesejado()
                ))
                .max(Comparator.comparingInt(
                        investimento -> calcularScore(investimento, perfilUsuario, request, horizonte)
                ))
                .orElseThrow(() -> new RuntimeException("Nenhum investimento compatível encontrado"));
    }

    private boolean possuiValorMinimo(Investimento investimento, BigDecimal valorInicial) {
        if (investimento.getValorMinimo() == null) {
            return true;
        }

        return valorInicial.compareTo(investimento.getValorMinimo()) >= 0;
    }

    private boolean riscoPermitido(NivelRisco riscoInvestimento, NivelRisco riscoDesejado) {
        return pesoRisco(riscoInvestimento) <= pesoRisco(riscoDesejado);
    }

    private int pesoRisco(NivelRisco risco) {
        return switch (risco) {
            case BAIXO -> 1;
            case MEDIO -> 2;
            case ALTO -> 3;
        };
    }

    private int calcularScore(Investimento investimento, PerfilInvestidor perfilUsuario, SimulacaoRequest request, HorizonteInvestimento horizonte) {
        int score = 0;

        if (investimento.getPerfilRecomendado() == perfilUsuario) {
            score += 40;
        }

        if (investimento.getObjetivoRecomendado() == request.objetivo()) {
            score += 30;
        }

        if (investimento.getHorizonteRecomendado() == horizonte) {
            score += 20;
        }

        if (investimento.getNivelRisco() == request.nivelRiscoDesejado()) {
            score += 10;
        }

        if (request.objetivo() == ObjetivoInvestimento.RESERVA_EMERGENCIA && investimento.getLiquidez() == NivelLiquidez.ALTA) {
            score += 10;
        }

        return score;
    }

    private HorizonteInvestimento converterPeriodoParaHorizonte(Integer periodoMeses) {
        if (periodoMeses <= 12) {
            return HorizonteInvestimento.CURTO;
        }

        if (periodoMeses <= 60) {
            return HorizonteInvestimento.MEDIO;
        }

        return HorizonteInvestimento.LONGO;
    }

    private BigDecimal buscarTaxaAnualTemporaria(Investimento investimento){

        /*
         * Primeira versão:
         * usa taxa temporária.
         *
         * Depois:
         * trocar isso por uma chamada para a API externa,
         * investimento.getCodigoApi().
         */

        String codigoApi = investimento.getCodigoApi();

        BigDecimal taxaBase = switch (codigoApi) {
            case "SELIC" -> BigDecimal.valueOf(10.50);
            case "CDI" -> BigDecimal.valueOf(10.40);
            case "IPCA" -> BigDecimal.valueOf(4.50);
            case "HGLG11" -> BigDecimal.valueOf(9.60);
            case "PETR4" -> BigDecimal.valueOf(14.00);
            case "BOVA11" -> BigDecimal.valueOf(12.00);
            default -> BigDecimal.valueOf(10.00);
        };

        if (investimento.getIndexador() == Indexador.IPCA) {
            BigDecimal taxaFixa = investimento.getTaxaFixaAnual() != null
                    ? investimento.getTaxaFixaAnual()
                    : BigDecimal.ZERO;

            return taxaBase.add(taxaFixa);
        }

        if (investimento.getPercentualIndexador() != null) {
            return taxaBase
                    .multiply(investimento.getPercentualIndexador())
                    .divide(BigDecimal.valueOf(100), 8, RoundingMode.HALF_UP);
        }
        return taxaBase;
    }

    private BigDecimal converterTaxaAnualParaMensal(BigDecimal taxaAnualPercentual) {
        double taxaAnualDecimal = taxaAnualPercentual
                .divide(BigDecimal.valueOf(100), 8, RoundingMode.HALF_UP)
                .doubleValue();

        double taxaMensalDecimal = Math.pow(1 + taxaAnualDecimal, 1.0 / 12.0) - 1;

        return BigDecimal.valueOf(taxaMensalDecimal)
                .setScale(8, RoundingMode.HALF_UP);
    }

    private List<ProjecaoMensalDTO> calcularProjecaoMensal(BigDecimal valorInicial, BigDecimal aporteMensal, Integer periodoMeses, BigDecimal taxaMensal) {
        List<ProjecaoMensalDTO> projecoes = new ArrayList<>();

        BigDecimal saldo = valorInicial;

        for (int mes = 1; mes <= periodoMeses; mes++) {
            BigDecimal saldoInicial = saldo;

            BigDecimal saldoComAporte = saldoInicial.add(aporteMensal);

            BigDecimal rendimento = saldoComAporte
                    .multiply(taxaMensal)
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal saldoFinal = saldoComAporte
                    .add(rendimento)
                    .setScale(2, RoundingMode.HALF_UP);

            projecoes.add(new ProjecaoMensalDTO(
                    mes,
                    saldoInicial.setScale(2, RoundingMode.HALF_UP),
                    aporteMensal.setScale(2, RoundingMode.HALF_UP),
                    rendimento,
                    saldoFinal
            ));

            saldo = saldoFinal;
        }

        return projecoes;
    }

    private String gerarMotivoRecomendacao(Investimento investimento, PerfilInvestidor perfilUsuario, SimulacaoRequest request, HorizonteInvestimento horizonte
    ) {
        return "O investimento "
                + investimento.getNome()
                + " foi recomendado porque combina com seu perfil "
                + perfilUsuario
                + ", com seu objetivo "
                + request.objetivo()
                + ", com horizonte "
                + horizonte
                + ", possui nível de risco "
                + investimento.getNivelRisco()
                + " e respeita o nível de risco desejado.";
    }

}

