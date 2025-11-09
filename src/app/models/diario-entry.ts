export interface DiarioEntry {
  id?: number;
  data: Date;
  contenuto: string;
  umore: 'felice' | 'neutro' | 'triste' | 'motivato' | 'stressato';
  tags?: string[];
  immagine?: string;
}
