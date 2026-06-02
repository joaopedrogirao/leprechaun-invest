package com.amanha.leprechaun_invest.domain.Investimento;

import com.amanha.leprechaun_invest.domain.usuario.PerfilInvestidor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestimentoRepository extends JpaRepository<Investimento, Long> {

    List<Investimento> findByPerfilRecomendado(PerfilInvestidor perfilRecomendado);
}
