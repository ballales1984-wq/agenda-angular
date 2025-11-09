export interface Obiettivo {
  id?: number;
  titolo: string;
  descrizione?: string;
  categoria: 'studio' | 'lavoro' | 'salute' | 'personale';
  frequenza: 'giornaliero' | 'settimanale' | 'mensile';
  ore_necessarie: number;
  ore_completate: number;
  progresso: number;
  data_inizio: Date;
  data_scadenza?: Date;
  completato: boolean;
}
