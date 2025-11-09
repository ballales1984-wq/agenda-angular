export interface Spesa {
  id?: number;
  importo: number;
  categoria: 'cibo' | 'trasporti' | 'intrattenimento' | 'salute' | 'altro';
  descrizione: string;
  data: Date;
  necessaria: boolean;
}
