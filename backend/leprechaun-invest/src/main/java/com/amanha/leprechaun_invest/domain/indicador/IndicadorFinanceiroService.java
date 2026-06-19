package com.amanha.leprechaun_invest.domain.indicador;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.amanha.leprechaun_invest.domain.Investimento.Indexador;
import com.amanha.leprechaun_invest.domain.Investimento.Investimento;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class IndicadorFinanceiroService {

    private static final Logger logger = LoggerFactory.getLogger(IndicadorFinanceiroService.class);

    private final RestTemplate restTemplate = new RestTemplate();

    public BigDecimal buscarTaxaAnual(Investimento investimento) {
        BigDecimal taxaBase = buscarTaxaBasePorCodigoApi(investimento.getCodigoApi());

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

    private BigDecimal buscarTaxaBasePorCodigoApi(String codigoApi) {
        return switch (codigoApi) {
            case "SELIC" -> buscarUltimoValorSerie("432");
            case "CDI" -> buscarCdiAnualizado();
            case "IPCA" -> buscarIpcaAnualizado();
            case "HGLG11" -> BigDecimal.valueOf(9.60);
            case "PETR4" -> BigDecimal.valueOf(14.00);
            case "BOVA11" -> BigDecimal.valueOf(12.00);
            default -> BigDecimal.valueOf(10.00);
        };
    }

    private BigDecimal buscarUltimoValorSerie(String codigoSerie) {
        String url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs."
                + codigoSerie
                + "/dados/ultimos/1?formato=json";

        try {
            IndicadorBcdDTO[] resposta = restTemplate.getForObject(url, IndicadorBcdDTO[].class);

            if (resposta == null || resposta.length == 0) {
                throw new RuntimeException("Resposta vazia da API do Banco Central");
            }

            BigDecimal valor = new BigDecimal(resposta[0].valor().replace(",", "."));

            logger.info("Taxa obtida pela API do Banco Central. Série: {}, Valor: {}", codigoSerie, valor);

            return valor;

        } catch (Exception e) {
            BigDecimal fallback = taxaFallback(codigoSerie);

            logger.warn("Falha ao acessar API do Banco Central. Usando fallback. Série: {}, Valor fallback: {}",
                    codigoSerie,
                    fallback
            );

            return fallback;
        }
    }

    private BigDecimal buscarIpcaAnualizado() {
        BigDecimal ipcaMensal = buscarUltimoValorSerie("433");

        return converterTaxaMensalParaAnual(ipcaMensal);
    }

    private BigDecimal converterTaxaMensalParaAnual(BigDecimal taxaMensalPercentual) {
        double taxaMensalDecimal = taxaMensalPercentual
                .divide(BigDecimal.valueOf(100), 12, RoundingMode.HALF_UP)
                .doubleValue();

        double taxaAnualDecimal = Math.pow(1 + taxaMensalDecimal, 12) - 1;

        return BigDecimal.valueOf(taxaAnualDecimal)
                .multiply(BigDecimal.valueOf(100))
                .setScale(4, RoundingMode.HALF_UP);
    }

    private BigDecimal taxaFallback(String codigoSerie) {
        return switch (codigoSerie) {
            case "432" -> BigDecimal.valueOf(10.50);
            case "12" -> BigDecimal.valueOf(10.40);
            case "433" -> BigDecimal.valueOf(0.37);
            default -> BigDecimal.valueOf(10.00);
        };
    }

    private BigDecimal buscarCdiAnualizado() {
        BigDecimal cdiDiario = buscarUltimoValorSerie("12");

        return converterTaxaDiariaParaAnual(cdiDiario);
    }

    private BigDecimal converterTaxaDiariaParaAnual(BigDecimal taxaDiariaPercentual) {
        double taxaDiariaDecimal = taxaDiariaPercentual
                .divide(BigDecimal.valueOf(100), 12, RoundingMode.HALF_UP)
                .doubleValue();

        double taxaAnualDecimal = Math.pow(1 + taxaDiariaDecimal, 252) - 1;

        return BigDecimal.valueOf(taxaAnualDecimal)
                .multiply(BigDecimal.valueOf(100))
                .setScale(4, RoundingMode.HALF_UP);
    }

}
