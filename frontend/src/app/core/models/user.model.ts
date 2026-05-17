import { perfilInvestidor } from "./investment.model";

export interface User {
    id: number;
    nome: string;
    email: string;
    perfil: perfilInvestidor;
    primeiroAcesso: boolean;
}