import { Mood, QuoteType } from './types';

// Usando caminhos locais relativos. 
// Certifique-se de que a pasta 'assets' esteja na raiz do seu projeto final (junto com index.html)
export const AVATAR_IMAGES: Record<Mood, string> = {
  [Mood.HAPPY]: './assets/einstein-happy.png', 
  [Mood.THINKING]: './assets/einstein-skeptical.png', 
  [Mood.EXCITED]: './assets/einstein-ecstatic.png', 
  [Mood.SHOCKED]: './assets/einstein-worried.png', 
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
    "Eita! Atingimos a massa crítica! Termine algo antes de adicionar mais.",
    "Meu cérebro está cheio! 5 tarefas é o limite do universo observável aqui.",
    "Stop! Sobrecarga no sistema. Foco nas 5 prioridades."
  ],
  idle: [
    "O tempo é uma ilusão... mas o prazo dessa tarefa não é!",
    "Se você não pode explicar o que está fazendo de forma simples, você não entendeu bem.",
    "Duas coisas são infinitas: o universo e a lista de tarefas... não, espera, a lista é só 5!"
  ]
};