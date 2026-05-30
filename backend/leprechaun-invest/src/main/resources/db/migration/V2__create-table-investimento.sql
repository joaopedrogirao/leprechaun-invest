CREATE TABLE modelos_investimento (
                                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                      nome VARCHAR(100) NOT NULL,
                                      tipo VARCHAR(50) NOT NULL,
                                      perfil_recomendado VARCHAR(50) NOT NULL,
                                      nivel_risco VARCHAR(50) NOT NULL,
                                      objetivo_recomendado VARCHAR(80) NOT NULL,
                                      horizonte_recomendado VARCHAR(50) NOT NULL,
                                      liquidez VARCHAR(50) NOT NULL,
                                      indexador VARCHAR(50) NOT NULL,
                                      percentual_indexador DECIMAL(10,2),
                                      taxa_fixa_anual DECIMAL(10,2),
                                      valor_minimo DECIMAL(15,2),
                                      codigo_api VARCHAR(50),
                                      descricao TEXT
);