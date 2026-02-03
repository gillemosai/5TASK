import { Mood, QuoteType } from './types';

const VERSION_QUERY = '?v=72';
const GITHUB_BASE = 'https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/';

export const AVATAR_IMAGES: Record<Mood, string> = {
  [Mood.HAPPY]: `${GITHUB_BASE}einstein-happy.png${VERSION_QUERY}`,
  [Mood.THINKING]: `${GITHUB_BASE}einstein-skeptical.png${VERSION_QUERY}`,
  [Mood.EXCITED]: `${GITHUB_BASE}einstein-ecstatic.png${VERSION_QUERY}`,
  [Mood.SHOCKED]: `${GITHUB_BASE}einstein-worried.png${VERSION_QUERY}`,
};

export const LOGO_URL = `${GITHUB_BASE}5task-logo.png${VERSION_QUERY}`;

export const QUOTES: Record<QuoteType, string[]> = {
  welcome: [
    "A imaginação é mais importante que o conhecimento! Vamos trabalhar?",
    "Não tenho talentos especiais, sou apenas apaixonadamente curioso.",
    "A mente que se abre a uma nova ideia jamais volta ao seu tamanho original.",
    "O tempo é relativo, mas sua produtividade não precisa ser.",
    "No meio da dificuldade encontra-se a oportunidade."
  ],
  add: [
    "Excelente! O único lugar onde o sucesso vem antes do trabalho é no dicionário.",
    "Mais uma tarefa? A vida é como andar de bicicleta, você deve se manter em movimento.",
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
    "Tudo deve ser feito da forma mais simples possível. 5 tarefas é a equação elegante.",
    "Atingimos a massa crítica de produtividade! Focar em poucas variáveis garante o sucesso."
  ],
  idle: [
    "O tempo é uma ilusão... mas o prazo dessa tarefa não é!",
    "Se você não pode explicar o que está fazendo de forma simples, você não entendeu bem.",
    "Duas coisas são infinitas: o universo e a criatividade humana. Vamos usá-la!"
  ]
};