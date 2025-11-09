export interface Post {
  id?: number;
  autore: string;
  avatar?: string;
  contenuto: string;
  tipo: 'obiettivo' | 'successo' | 'motivazione' | 'domanda';
  likes: number;
  commenti: number;
  data: Date;
  tags?: string[];
  condiviso?: boolean;
}

export interface Commento {
  id?: number;
  postId: number;
  autore: string;
  contenuto: string;
  data: Date;
}
