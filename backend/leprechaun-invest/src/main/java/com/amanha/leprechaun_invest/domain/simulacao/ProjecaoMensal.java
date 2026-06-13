package com.amanha.leprechaun_invest.domain.simulacao;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Table(name = "projecao_mensal")
@Entity(name = "projecao_mensal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class ProjecaoMensal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "simulacao_id", nullable = false)
    private Simulacao simulacao;

    private Integer mes;

    private BigDecimal saldoInicial;

    private BigDecimal aporte;

    private BigDecimal rendimento;

    private BigDecimal saldoFinal;

    public ProjecaoMensal(Integer mes, BigDecimal saldoInicial, BigDecimal aporte, BigDecimal rendimento, BigDecimal saldoFinal) {
        this.mes = mes;
        this.saldoInicial = saldoInicial;
        this.aporte = aporte;
        this.rendimento = rendimento;
        this.saldoFinal = saldoFinal;
    }
}
