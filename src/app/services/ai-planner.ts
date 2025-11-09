import { Injectable, signal } from '@angular/core';
import { ApiService } from './api';
import { ToastService } from './toast';
import { Obiettivo } from '../models/obiettivo';
import { Impegno } from '../models/impegno';

export interface PianoStudio {
  obiettivo: string;
  livello: 'principiante' | 'intermedio' | 'avanzato';
  oreDisponibili: number; // ore a settimana
  durataSettimane: number;
  task: TaskGiornaliero[];
  milestone: Milestone[];
}

export interface TaskGiornaliero {
  id: number;
  titolo: string;
  descrizione: string;
  giorno: Date;
  oraInizio: string;
  oraFine: string;
  completato: boolean;
  argomento: string;
}

export interface Milestone {
  settimana: number;
  obiettivo: string;
  completato: boolean;
}

export interface DomandaPiano {
  domanda: string;
  tipo: 'ore' | 'livello' | 'deadline' | 'frequenza';
  opzioni?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AiPlannerService {
  // Conversazione attiva
  conversazioneAttiva = signal(false);
  obiettivoCorrente = signal('');
  domandeRimaste = signal<DomandaPiano[]>([]);
  risposte = signal<{[key: string]: any}>({});
  
  // Piano generato
  pianoGenerato = signal<PianoStudio | null>(null);

  constructor(
    private apiService: ApiService,
    private toastService: ToastService
  ) {}

  // AVVIA PIANIFICAZIONE da un obiettivo
  avviaPianificazione(obiettivo: string) {
    console.log('🧠 AI Planner: Avvio pianificazione per:', obiettivo);
    this.obiettivoCorrente.set(obiettivo);
    this.conversazioneAttiva.set(true);
    
    // Genera domande in base all'obiettivo
    const domande = this.generaDomande(obiettivo);
    this.domandeRimaste.set(domande);
    this.risposte.set({});
    
    return domande[0]; // Ritorna prima domanda
  }

  // GENERA domande intelligenti
  private generaDomande(obiettivo: string): DomandaPiano[] {
    const lower = obiettivo.toLowerCase();
    const domande: DomandaPiano[] = [];
    
    // Domanda 1: Livello attuale
    if (lower.includes('imparare') || lower.includes('studiare')) {
      domande.push({
        domanda: `Qual è il tuo livello attuale in ${obiettivo}?`,
        tipo: 'livello',
        opzioni: ['Principiante (parto da zero)', 'Intermedio (conosco le basi)', 'Avanzato (voglio approfondire)']
      });
    }
    
    // Domanda 2: Tempo disponibile
    domande.push({
      domanda: 'Quante ore a settimana puoi dedicare a questo obiettivo?',
      tipo: 'ore',
      opzioni: ['3-5 ore', '6-10 ore', '11-15 ore', '16-20 ore', '20+ ore']
    });
    
    // Domanda 3: Quando preferisci studiare
    domande.push({
      domanda: 'Quando preferisci studiare/lavorarci?',
      tipo: 'frequenza',
      opzioni: ['Mattina presto (7-10)', 'Giorno (10-14)', 'Pomeriggio (14-18)', 'Sera (18-22)', 'Flessibile']
    });
    
    // Domanda 4: Deadline
    domande.push({
      domanda: 'Entro quando vuoi raggiungere l\'obiettivo?',
      tipo: 'deadline',
      opzioni: ['1 mese', '2-3 mesi', '6 mesi', '1 anno', 'Nessuna fretta']
    });
    
    return domande;
  }

  // REGISTRA risposta
  registraRisposta(domanda: DomandaPiano, risposta: string) {
    console.log('💬 Risposta ricevuta:', risposta);
    
    // Salva risposta
    this.risposte.update(r => ({
      ...r,
      [domanda.tipo]: risposta
    }));
    
    // Rimuovi domanda corrente
    this.domandeRimaste.update(d => d.slice(1));
    
    // Se non ci sono più domande, genera il piano!
    if (this.domandeRimaste().length === 0) {
      this.generaPiano();
      return null;
    }
    
    // Ritorna prossima domanda
    return this.domandeRimaste()[0];
  }

  // GENERA PIANO AUTOMATICO
  private generaPiano() {
    console.log('🧠 Generazione piano automatico...');
    const obiettivo = this.obiettivoCorrente();
    const risposte = this.risposte();
    
    // Estrai ore dalla risposta (es: "6-10 ore" -> 8)
    const oreMatch = risposte['ore']?.match(/(\d+)/);
    const oreSettimana = oreMatch ? parseInt(oreMatch[1]) : 5;
    
    // Estrai livello
    let livello: 'principiante' | 'intermedio' | 'avanzato' = 'principiante';
    if (risposte['livello']?.includes('Intermedio')) livello = 'intermedio';
    if (risposte['livello']?.includes('Avanzato')) livello = 'avanzato';
    
    // Estrai durata in settimane
    let durataSettimane = 12;
    if (risposte['deadline']?.includes('1 mese')) durataSettimane = 4;
    if (risposte['deadline']?.includes('2-3 mesi')) durataSettimane = 10;
    if (risposte['deadline']?.includes('6 mesi')) durataSettimane = 24;
    if (risposte['deadline']?.includes('1 anno')) durataSettimane = 52;
    
    // Genera task basati sull'obiettivo
    const task = this.generaTask(obiettivo, oreSettimana, durataSettimane, livello, risposte['frequenza']);
    const milestone = this.generaMilestone(obiettivo, durataSettimane, livello);
    
    const piano: PianoStudio = {
      obiettivo,
      livello,
      oreDisponibili: oreSettimana,
      durataSettimane,
      task,
      milestone
    };
    
    this.pianoGenerato.set(piano);
    this.conversazioneAttiva.set(false);
    
    console.log('✅ Piano generato:', piano);
    this.toastService.success(`✅ Piano creato! ${task.length} task programmati in ${durataSettimane} settimane!`);
    
    // SALVA AUTOMATICAMENTE nel calendario e obiettivi
    this.salvaPianoNelCalendario(piano);
  }

  // GENERA TASK giornalieri intelligenti
  private generaTask(obiettivo: string, oreSettimana: number, settimane: number, livello: string, preferenzaOrario: string): TaskGiornaliero[] {
    const task: TaskGiornaliero[] = [];
    const oggi = new Date();
    
    // Determina argomenti base sull'obiettivo
    let argomenti: string[] = [];
    const lower = obiettivo.toLowerCase();
    
    if (lower.includes('python')) {
      if (livello === 'principiante') {
        argomenti = ['Sintassi base', 'Variabili e tipi', 'Condizioni e loop', 'Funzioni', 'Liste e dizionari', 
                     'File I/O', 'Moduli', 'OOP base', 'Librerie standard', 'Progetto pratico'];
      } else if (livello === 'intermedio') {
        argomenti = ['OOP avanzato', 'Decoratori', 'Generators', 'Context managers', 'Testing', 
                     'Django/Flask', 'API REST', 'Database', 'Async/await', 'Progetto completo'];
      } else {
        argomenti = ['Design patterns', 'Performance', 'Concurrency', 'Metaclassi', 'C extensions',
                     'Machine Learning', 'Data Science', 'DevOps', 'Architetture', 'Portfolio project'];
      }
    } else if (lower.includes('angular')) {
      argomenti = ['Componenti', 'Templates', 'Signals', 'Servizi', 'Routing', 'Forms', 'HTTP', 'RxJS', 'Testing', 'Progetto'];
    } else {
      // Obiettivo generico
      argomenti = ['Introduzione', 'Concetti base', 'Pratica', 'Intermedio', 'Avanzato', 'Progetto', 'Revisione', 'Consolidamento'];
    }
    
    // Determina ora preferita
    let oraInizio = '14:00';
    if (preferenzaOrario?.includes('Mattina')) oraInizio = '08:00';
    if (preferenzaOrario?.includes('Giorno')) oraInizio = '10:00';
    if (preferenzaOrario?.includes('Sera')) oraInizio = '19:00';
    
    // Calcola ore per task
    const totaleOre = oreSettimana * settimane;
    const orePerArgomento = Math.ceil(totaleOre / argomenti.length);
    
    // Genera task distribuiti nel tempo
    let taskId = 1;
    let giornoCorrente = 0;
    
    argomenti.forEach((argomento, index) => {
      const sessioniPerArgomento = Math.ceil(orePerArgomento / 2); // 2 ore per sessione
      
      for (let sessione = 0; sessione < sessioniPerArgomento; sessione++) {
        const dataTask = new Date(oggi);
        dataTask.setDate(oggi.getDate() + giornoCorrente);
        
        // Salta weekend se preferenza non è "Flessibile"
        if (!preferenzaOrario?.includes('Flessibile')) {
          while (dataTask.getDay() === 0 || dataTask.getDay() === 6) {
            giornoCorrente++;
            dataTask.setDate(oggi.getDate() + giornoCorrente);
          }
        }
        
        const oraFine = this.calcolaOraFine(oraInizio, 2);
        
        task.push({
          id: taskId++,
          titolo: `${argomento} - Sessione ${sessione + 1}`,
          descrizione: `Studio ${obiettivo}: ${argomento}`,
          giorno: dataTask,
          oraInizio: oraInizio,
          oraFine: oraFine,
          completato: false,
          argomento: argomento
        });
        
        // Prossimo giorno (2-3 giorni dopo per spacing)
        giornoCorrente += Math.floor(Math.random() * 2) + 2;
      }
    });
    
    return task.slice(0, 50); // Max 50 task per non sovraccaricare
  }

  // GENERA MILESTONE
  private generaMilestone(obiettivo: string, settimane: number, livello: string): Milestone[] {
    const milestone: Milestone[] = [];
    const step = Math.ceil(settimane / 4); // 4 milestone
    
    if (obiettivo.toLowerCase().includes('python')) {
      milestone.push(
        { settimana: step, obiettivo: 'Completata sintassi base + esercizi', completato: false },
        { settimana: step * 2, obiettivo: 'Primo progetto funzionante', completato: false },
        { settimana: step * 3, obiettivo: 'Librerie avanzate + API', completato: false },
        { settimana: step * 4, obiettivo: 'Progetto completo portfolio', completato: false }
      );
    } else {
      milestone.push(
        { settimana: step, obiettivo: `${obiettivo} - Basi completate`, completato: false },
        { settimana: step * 2, obiettivo: `${obiettivo} - Livello intermedio`, completato: false },
        { settimana: step * 3, obiettivo: `${obiettivo} - Progetto pratico`, completato: false },
        { settimana: step * 4, obiettivo: `${obiettivo} - Obiettivo raggiunto!`, completato: false }
      );
    }
    
    return milestone;
  }

  // SALVA piano nel calendario
  private salvaPianoNelCalendario(piano: PianoStudio) {
    console.log('📅 Salvo piano nel calendario...');
    
    // Crea obiettivo principale
    const obiettivo: Obiettivo = {
      id: Date.now(),
      titolo: piano.obiettivo,
      descrizione: `Piano AI generato: ${piano.task.length} task in ${piano.durataSettimane} settimane`,
      categoria: 'studio',
      frequenza: 'settimanale',
      ore_necessarie: piano.oreDisponibili * piano.durataSettimane,
      ore_completate: 0,
      progresso: 0,
      data_inizio: new Date(),
      completato: false
    };
    
    this.apiService.obiettivi.update(obs => [...obs, obiettivo]);
    
    // Aggiungi primi 7 task al calendario (per non sovraccaricare)
    const primiTask = piano.task.slice(0, 7);
    
    primiTask.forEach(task => {
      const impegno: Impegno = {
        id: task.id,
        titolo: task.titolo,
        descrizione: task.descrizione,
        data: task.giorno,
        ora_inizio: task.oraInizio,
        ora_fine: task.oraFine,
        categoria: 'studio',
        completato: false,
        promemoria: true
      };
      
      this.apiService.impegni.update(imp => [...imp, impegno]);
    });
    
    console.log(`✅ ${primiTask.length} task aggiunti al calendario`);
    this.toastService.success(`📅 ${primiTask.length} sessioni programmate! Vedi il calendario!`);
  }

  // Helper: calcola ora fine
  private calcolaOraFine(oraInizio: string, durata: number): string {
    const [h, m] = oraInizio.split(':').map(Number);
    const minutiTotali = h * 60 + m + durata * 60;
    const ore = Math.floor(minutiTotali / 60) % 24;
    const minuti = minutiTotali % 60;
    return `${ore.toString().padStart(2, '0')}:${minuti.toString().padStart(2, '0')}`;
  }

  // RESET conversazione
  reset() {
    this.conversazioneAttiva.set(false);
    this.obiettivoCorrente.set('');
    this.domandeRimaste.set([]);
    this.risposte.set({});
    this.pianoGenerato.set(null);
  }
}
