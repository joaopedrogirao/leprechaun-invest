CREATE TABLE simulacao (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            nome VARCHAR(100) NOT NULL,

                            usuario_id BIGINT NOT NULL,
                            investimento_id BIGINT NOT NULL,

                            valor_inicial DECIMAL(15,2) NOT NULL,
                            aporte_mensal DECIMAL(15,2) NOT NULL,
                            periodo_meses INT NOT NULL,

                            objetivo VARCHAR(80) NOT NULL,
                            nivel_risco_desejado VARCHAR(50) NOT NULL,
                            horizonte VARCHAR(50) NOT NULL,

                            taxa_anual_usada DECIMAL(10,6) NOT NULL,
                            taxa_mensal_usada DECIMAL(18,8) NOT NULL,

                            valor_final DECIMAL(15,2) NOT NULL,
                            total_investido DECIMAL(15,2) NOT NULL,
                            total_rendimento DECIMAL(15,2) NOT NULL,

                            codigo_api_usado VARCHAR(50),
                            data_criacao DATETIME NOT NULL,

                            CONSTRAINT fk_simulacoes_usuario
                                FOREIGN KEY (usuario_id) REFERENCES usuario(id),

                            CONSTRAINT fk_simulacoes_investimento
                                FOREIGN KEY (investimento_id) REFERENCES modelos_investimento(id)
);

CREATE TABLE projecao_mensal (
                                   id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                   simulacao_id BIGINT NOT NULL,

                                   mes INT NOT NULL,
                                   saldo_inicial DECIMAL(15,2) NOT NULL,
                                   aporte DECIMAL(15,2) NOT NULL,
                                   rendimento DECIMAL(15,2) NOT NULL,
                                   saldo_final DECIMAL(15,2) NOT NULL,

                                   CONSTRAINT fk_projecoes_simulacao
                                       FOREIGN KEY (simulacao_id) REFERENCES simulacao(id)
                                           ON DELETE CASCADE
);