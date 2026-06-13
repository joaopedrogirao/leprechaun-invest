package com.amanha.leprechaun_invest.domain.simulacao;

import com.amanha.leprechaun_invest.domain.Investimento.HorizonteInvestimento;
import com.amanha.leprechaun_invest.domain.Investimento.Investimento;
import com.amanha.leprechaun_invest.domain.Investimento.NivelRisco;
import com.amanha.leprechaun_invest.domain.Investimento.ObjetivoInvestimento;
import com.amanha.leprechaun_invest.domain.usuario.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Table(name = "simulacao")
@Entity(name = "simulacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Simulacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "investimento_id", nullable = false)
    private Investimento investimento;

    private BigDecimal valorInicial;

    private BigDecimal aporteMensal;

    private Integer periodoMeses;

    @Enumerated(EnumType.STRING)
    private ObjetivoInvestimento objetivo;

    @Enumerated(EnumType.STRING)
    private NivelRisco nivelRiscoDesejado;

    @Enumerated(EnumType.STRING)
    private HorizonteInvestimento horizonte;

    private BigDecimal taxaAnualUsada;

    private BigDecimal taxaMensalUsada;

    private BigDecimal valorFinal;

    private BigDecimal totalInvestido;

    private BigDecimal totalRendimento;

    private String codigoApiUsado;

    private LocalDateTime dataCriacao;

    @OneToMany(mappedBy = "simulacao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjecaoMensal> projecoesMensais = new ArrayList<>();

    public void adicionarProjecao(ProjecaoMensal projecao) {
        projecao.setSimulacao(this);
        this.projecoesMensais.add(projecao);
    }
}
