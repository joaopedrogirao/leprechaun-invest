package com.amanha.leprechaun_invest.domain.indicador;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record BrapiResponseDTO(List<ResultDTO> results) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ResultDTO(
            String symbol,
            Double regularMarketPrice,
            Double dividendYield
    ) {}
}
