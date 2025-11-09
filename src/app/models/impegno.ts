export interface Impegno {
  id?: number;
  titolo: string;
  descrizione?: string;
  data: Date;
  ora_inizio: string;
  ora_fine: string;
  categoria: 'lavoro' | 'studio' | 'personale' | 'sport' | 'altro';
  completato: boolean;
  promemoria?: boolean;
}
