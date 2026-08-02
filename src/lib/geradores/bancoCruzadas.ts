import type { ItemCruzada } from "./cruzadas";

export const CATEGORIAS_CRUZADAS: Record<string, ItemCruzada[]> = {
  animais: [
    { palavra: "LEAO", dica: "Rei da selva" },
    { palavra: "GATO", dica: "Animal doméstico que mia" },
    { palavra: "CACHORRO", dica: "Melhor amigo do homem" },
    { palavra: "ELEFANTE", dica: "O maior animal terrestre" },
    { palavra: "COELHO", dica: "Tem orelhas compridas e pula" },
    { palavra: "TARTARUGA", dica: "Anda devagar e tem casco" },
    { palavra: "BORBOLETA", dica: "Já foi lagarta antes de voar" },
    { palavra: "GIRAFA", dica: "Tem o pescoço mais comprido" },
  ],
  frutas: [
    { palavra: "BANANA", dica: "Fruta amarela e curvada" },
    { palavra: "MORANGO", dica: "Fruta vermelha pequena e docinha" },
    { palavra: "ABACAXI", dica: "Fruta com coroa de folhas" },
    { palavra: "MELANCIA", dica: "Fruta verde por fora, vermelha por dentro" },
    { palavra: "UVA", dica: "Cresce em cachos" },
    { palavra: "LARANJA", dica: "Fruta cítrica, mesma cor do nome" },
    { palavra: "MANGA", dica: "Fruta tropical bem doce" },
  ],
  profissoes: [
    { palavra: "PROFESSOR", dica: "Ensina na escola" },
    { palavra: "MEDICO", dica: "Cuida da saúde das pessoas" },
    { palavra: "BOMBEIRO", dica: "Apaga incêndios" },
    { palavra: "DENTISTA", dica: "Cuida dos dentes" },
    { palavra: "COZINHEIRO", dica: "Prepara a comida" },
    { palavra: "ARTISTA", dica: "Cria pinturas e desenhos" },
  ],
};

export const ROTULO_CATEGORIA_CRUZADAS: Record<string, string> = {
  animais: "Animais",
  frutas: "Frutas",
  profissoes: "Profissões",
};
