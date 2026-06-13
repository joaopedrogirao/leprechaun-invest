package com.amanha.leprechaun_invest.domain.simulacao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SimulacaoRepository extends JpaRepository<Simulacao, Long> {
    
    List<Simulacao> findByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);

    Optional<Simulacao> findByIdAndUsuarioId(Long id, Long usuarioId);
}
