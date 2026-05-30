package com.amanha.leprechaun_invest.domain.Investimento;

import com.amanha.leprechaun_invest.domain.usuario.PerfilInvestidor;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "modelos_investimento")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Investimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String nome;

    @Enumerated(EnumType.STRING)
    private TipoInvestimento tipo;

    @Enumerated(EnumType.STRING)
    private PerfilInvestidor perfilRecomendado;

    @Enumerated(EnumType.STRING)
    private NivelRisco nivelRisco;

    @Enumerated(EnumType.STRING)
    private ObjetivoInvestimento objetivoRecomendado;

    @Enumerated(EnumType.STRING)
    private HorizonteInvestimento horizonteRecomendado;

    @Enumerated(EnumType.STRING)
    private NivelLiquidez liquidez;

    @Enumerated(EnumType.STRING)
    private Indexador indexador;

    private BigDecimal percentualIndexador;

    private BigDecimal taxaFixaAnual;

    private BigDecimal valorMinimo;

    private String codigoApi;

    @Column(columnDefinition = "TEXT")
    private String descricao;

}
