export interface Habit {
  id?: number;
  nome: string;
  descrizione?: string;
  emoji: string;
  frequenza: 'giornaliero' | 'settimanale';
  obiettivo: number; // giorni/settimana
  categoria: 'salute' | 'studio' | 'sport' | 'mindfulness' | 'produttivita' | 'altro';
  completamenti: HabitLog[];
  streak: number; // giorni consecutivi
  totalCompletamenti: number;
}

export interface HabitLog {
  data: Date;
  completato: boolean;
  note?: string;
}
