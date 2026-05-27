CREATE TABLE usuario (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         email VARCHAR(150) NOT NULL UNIQUE,
                         nome VARCHAR(100) NOT NULL,
                         senha VARCHAR(255) NOT NULL,
                         perfil_investidor VARCHAR(30)
);