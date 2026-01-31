import { Mood, QuoteType } from './types';

import einsteinHappy from './assets/einstein-happy.png';
import einsteinSkeptical from './assets/einstein-skeptical.png';
import einsteinEcstatic from './assets/einstein-ecstatic.png';
import einsteinWorried from './assets/einstein-worried.png';

export const AVATAR_IMAGES: Record<Mood, string> = {
  [Mood.HAPPY]: einsteinHappy,
  [Mood.THINKING]: einsteinSkeptical,
  [Mood.EXCITED]: einsteinEcstatic,
  [Mood.SHOCKED]: einsteinWorried,
};

export const QUOTES: Record<QuoteType, string[]> = {
  welcome: [
    "A imaginação é mais importante que o conhecimento! Vamos trabalhar?",
    "Não tenho talentos especiais, sou apenas apaixonadamente curioso sobre suas tarefas.",
    "A mente que se abre a uma nova ideia jamais voltará ao seu tamanho original."
  ],
  add: [
    "Excelente! O único lugar onde o sucesso vem antes do trabalho é no dicionário.",
    "Mais uma tarefa? A vida é como andar de bicicleta, para manter o equilíbrio, você deve se manter em movimento.",
    "Foco total! No meio da dificuldade encontra-se a oportunidade."
  ],
  complete: [
    "Genial! A criatividade é a inteligência se divertindo.",
    "Fantástico! Você está desafiando as leis da procrastinação.",
    "Maravilhoso! O tempo é relativo, mas você foi rápido!"
  ],
  delete: [
    "Puf! Desapareceu como uma partícula quântica.",
    "Menos é mais. Simplicidade é o grau máximo de sofisticação.",
    "Limpando o espaço-tempo para novas ideias."
  ],
  full: [
    "Tudo deve ser feito da forma mais simples possível. 5 tarefas é a equação elegante para hoje.",
    "Atingimos a massa crítica de produtividade! Focar em poucas variáveis garante o sucesso da teoria.",
    "Até a velocidade da luz tem limite! Vamos concluir estas 5 para manter a eficiência máxima."
  ],
  idle: [
    "O tempo é uma ilusão... mas o prazo dessa tarefa não é!",
    "Se você não pode explicar o que está fazendo de forma simples, você não entendeu bem.",
    "Duas coisas são infinitas: o universo e a criatividade humana. Vamos usá-la aqui!"
  ]
};