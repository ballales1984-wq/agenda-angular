import { Injectable, signal } from '@angular/core';
import { ApiService } from './api';
import { ToastService } from './toast';
import { Obiettivo } from '../models/obiettivo';
import { Impegno } from '../models/impegno';

export interface PianoStudio {
  obiettivo: string;
  categoria: 'studio' | 'sport' | 'lavoro' | 'salute' | 'hobby' | 'benessere';
  livello: 'principiante' | 'intermedio' | 'avanzato';
  oreDisponibili: number; // ore a settimana
  durataSettimane: number;
  task: TaskGiornaliero[];
  milestone: Milestone[];
  metriche: MetricaProgresso[];
}

export interface MetricaProgresso {
  nome: string; // es: "Km corsi", "Pagine lette", "Ore praticate"
  valore: number;
  obiettivo: number;
  unita: string; // "km", "pagine", "ore"
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
    const categoriaRilevata = this.rilevaCategoria(obiettivo);
    const milestone = this.generaMilestone(obiettivo, durataSettimane, livello, categoriaRilevata);
    const metriche = this.generaMetriche(obiettivo, categoriaRilevata, durataSettimane);
    
    const piano: PianoStudio = {
      obiettivo,
      categoria: categoriaRilevata,
      livello,
      oreDisponibili: oreSettimana,
      durataSettimane,
      task,
      milestone,
      metriche
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
    const lower = obiettivo.toLowerCase();
    
    // Determina CATEGORIA e ARGOMENTI intelligenti
    let argomenti: string[] = [];
    let categoria: 'studio' | 'sport' | 'lavoro' | 'salute' | 'hobby' | 'benessere' = 'studio';
    
    // 🏃 CORSA / RUNNING
    if (lower.includes('corsa') || lower.includes('correre') || lower.includes('running') || lower.includes('maratona')) {
      categoria = 'sport';
      if (livello === 'principiante') {
        argomenti = ['Camminata veloce 20min', 'Corsa leggera 5min', 'Interval 10min', 'Corsa 15min', 
                     'Corsa 20min', 'Corsa 25min', 'Corsa 30min', 'Corsa 40min', 'Test 5km', 'Mantenimento'];
      } else if (livello === 'intermedio') {
        argomenti = ['5km facile', 'Interval training', '7km progressivo', 'Fartlek 30min', '10km lento',
                     'Ripetute 400m', '12km medio', 'Lungo 15km', 'Test 10km', 'Half marathon prep'];
      } else {
        argomenti = ['10km tempo race', 'Interval 1000m', '15km progressivo', 'Hill training', '20km lungo',
                     'Speed work', '25km endurance', 'Tapering', 'Race simulation', 'Marathon ready'];
      }
    }
    // 💪 FITNESS / PALESTRA
    else if (lower.includes('palestra') || lower.includes('fitness') || lower.includes('allenamento')) {
      categoria = 'sport';
      if (livello === 'principiante') {
        argomenti = ['Corpo libero base', 'Pesi leggeri', 'Squat e Deadlift', 'Petto e Spalle', 'Schiena e Bicipiti',
                     'Gambe', 'Core workout', 'Cardio HIIT', 'Stretching', 'Full body'];
      } else {
        argomenti = ['Push day', 'Pull day', 'Leg day', 'Upper body', 'Lower body', 'Core & Abs',
                     'HIIT cardio', 'Strength training', 'Mobility', 'Recovery'];
      }
    }
    // 🧘 BENESSERE / MEDITAZIONE
    else if (lower.includes('meditazione') || lower.includes('yoga') || lower.includes('mindfulness')) {
      categoria = 'benessere';
      argomenti = ['Respiro base 5min', 'Body scan 10min', 'Mindfulness 15min', 'Meditazione guidata',
                   'Yoga mattutino', 'Gratitudine serale', 'Visualizzazione', 'Mantra practice',
                   'Deep meditation 20min', 'Routine completa'];
    }
    // 🎨 HOBBY / CREATIVITÀ
    else if (lower.includes('disegno') || lower.includes('pittura') || lower.includes('musica') || lower.includes('chitarra')) {
      categoria = 'hobby';
      argomenti = ['Fondamentali', 'Tecnica base', 'Esercizi daily', 'Pratica intermedia', 'Creatività',
                   'Studio avanzato', 'Progetto personale', 'Refinement', 'Performance', 'Portfolio'];
    }
    // 📚 STUDIO - PYTHON
    else if (lower.includes('python')) {
      categoria = 'studio';
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
    }
    // 📚 STUDIO - ANGULAR
    else if (lower.includes('angular')) {
      categoria = 'studio';
      argomenti = ['Componenti', 'Templates', 'Signals', 'Servizi', 'Routing', 'Forms', 'HTTP', 'RxJS', 'Testing', 'Progetto'];
    }
    // 📚 STUDIO - LINGUE
    else if (lower.includes('inglese') || lower.includes('spagnolo') || lower.includes('francese') || lower.includes('lingua')) {
      categoria = 'studio';
      argomenti = ['Alfabeto e pronuncia', 'Vocabolario base 100 parole', 'Frasi comuni', 'Grammatica base',
                   'Conversazione semplice', 'Ascolto podcast', 'Lettura testi', 'Scrittura journal',
                   'Video in lingua', 'Pratica conversazione'];
    }
    // 💼 LAVORO / CARRIERA
    else if (lower.includes('lavoro') || lower.includes('carriera') || lower.includes('business')) {
      categoria = 'lavoro';
      argomenti = ['Analisi situazione', 'Definizione obiettivi', 'Skill mapping', 'Networking',
                   'Portfolio/CV', 'Progetti showcase', 'Interview prep', 'Personal brand',
                   'LinkedIn optimization', 'Job search strategy'];
    }
    // 🍎 SALUTE / DIETA
    else if (lower.includes('dieta') || lower.includes('peso') || lower.includes('dimagrire') || lower.includes('salute')) {
      categoria = 'salute';
      argomenti = ['Piano alimentare', 'Idratazione tracking', 'Meal prep domenica', 'Snack sani',
                   'Calorie monitoring', 'Macronutrienti', 'Peso settimanale', 'Sonno quality',
                   'Stress management', 'Check-up finale'];
    }
    // 📖 LETTURA
    else if (lower.includes('leggere') || lower.includes('libri') || lower.includes('lettura')) {
      categoria = 'hobby';
      argomenti = ['Libro 1 - Cap 1-5', 'Libro 1 - Cap 6-10', 'Libro 1 - Finale', 'Riflessione Libro 1',
                   'Libro 2 - Inizio', 'Libro 2 - Metà', 'Libro 2 - Fine', 'Libro 3',
                   'Libro 4', 'Revisione e note'];
    }
    // 🎯 DEFAULT - GENERICO
    else {
      argomenti = ['Setup e preparazione', 'Fondamentali', 'Pratica base', 'Sviluppo intermedio', 
                   'Consolidamento', 'Tecnica avanzata', 'Applicazione pratica', 'Progetto reale',
                   'Refinement', 'Obiettivo raggiunto'];
    }
    
    // Determina ora preferita e durata
    let oraInizio = '14:00';
    let durataSessione = 2; // default 2 ore
    
    if (preferenzaOrario?.includes('Mattina')) oraInizio = '07:00';
    if (preferenzaOrario?.includes('Giorno')) oraInizio = '10:00';
    if (preferenzaOrario?.includes('Pomeriggio')) oraInizio = '14:00';
    if (preferenzaOrario?.includes('Sera')) oraInizio = '19:00';
    
    // Durata intelligente basata su categoria
    if (categoria === 'sport') durataSessione = 1; // 1h per sport
    if (categoria === 'benessere') durataSessione = 0.5; // 30 min
    
    // Calcola sessioni
    const totaleOre = oreSettimana * settimane;
    const orePerArgomento = Math.ceil(totaleOre / argomenti.length);
    const sessioniPerArgomento = Math.ceil(orePerArgomento / durataSessione);
    
    // Genera task distribuiti intelligentemente
    let taskId = 1;
    let giornoCorrente = 1; // Inizia domani
    
    argomenti.forEach((argomento, index) => {
      for (let sessione = 0; sessione < sessioniPerArgomento; sessione++) {
        const dataTask = new Date(oggi);
        dataTask.setDate(oggi.getDate() + giornoCorrente);
        
        // LOGICA SMART PER CATEGORIA:
        
        // SPORT: Giorni alternati (recupero!)
        if (categoria === 'sport') {
          // Lun, Mer, Ven o Mar, Gio, Sab
          while (dataTask.getDay() === 0) { // Salta domenica
            giornoCorrente++;
            dataTask.setDate(oggi.getDate() + giornoCorrente);
          }
          giornoCorrente += 2; // Sempre 1 giorno riposo
        }
        // BENESSERE: Tutti i giorni
        else if (categoria === 'benessere') {
          giornoCorrente += 1; // Quotidiano
        }
        // STUDIO/LAVORO: Settimana lavorativa
        else {
          while (dataTask.getDay() === 0 || dataTask.getDay() === 6) { // Salta weekend
            giornoCorrente++;
            dataTask.setDate(oggi.getDate() + giornoCorrente);
          }
          giornoCorrente += Math.floor(Math.random() * 2) + 2; // 2-3 giorni
        }
        
        const oraFine = this.calcolaOraFine(oraInizio, durataSessione);
        
        task.push({
          id: taskId++,
          titolo: argomento,
          descrizione: `${obiettivo}: ${argomento}`,
          giorno: dataTask,
          oraInizio: oraInizio,
          oraFine: oraFine,
          completato: false,
          argomento: argomento
        });
      }
    });
    
    return task.slice(0, 50); // Max 50 task
  }

  // RILEVA CATEGORIA
  private rilevaCategoria(obiettivo: string): 'studio' | 'sport' | 'lavoro' | 'salute' | 'hobby' | 'benessere' {
    const lower = obiettivo.toLowerCase();
    
    if (lower.includes('corsa') || lower.includes('palestra') || lower.includes('sport') || lower.includes('fitness') || 
        lower.includes('nuoto') || lower.includes('ciclismo') || lower.includes('calcio')) {
      return 'sport';
    }
    if (lower.includes('meditazione') || lower.includes('yoga') || lower.includes('mindfulness') || lower.includes('benessere')) {
      return 'benessere';
    }
    if (lower.includes('dieta') || lower.includes('salute') || lower.includes('peso') || lower.includes('dormire')) {
      return 'salute';
    }
    if (lower.includes('lavoro') || lower.includes('carriera') || lower.includes('business') || lower.includes('startup')) {
      return 'lavoro';
    }
    if (lower.includes('disegno') || lower.includes('musica') || lower.includes('chitarra') || lower.includes('pittura') || 
        lower.includes('fotografia') || lower.includes('hobby')) {
      return 'hobby';
    }
    // Default: studio
    return 'studio';
  }

  // GENERA METRICHE di progresso
  private generaMetriche(obiettivo: string, categoria: string, settimane: number): MetricaProgresso[] {
    const lower = obiettivo.toLowerCase();
    const metriche: MetricaProgresso[] = [];
    
    if (lower.includes('corsa') || lower.includes('running')) {
      metriche.push(
        { nome: 'Km totali', valore: 0, obiettivo: settimane * 15, unita: 'km' },
        { nome: 'Sessioni completate', valore: 0, obiettivo: settimane * 3, unita: 'sessioni' },
        { nome: 'Km record settimanale', valore: 0, obiettivo: 30, unita: 'km' }
      );
    } else if (lower.includes('palestra') || lower.includes('fitness')) {
      metriche.push(
        { nome: 'Allenamenti completati', valore: 0, obiettivo: settimane * 3, unita: 'sessioni' },
        { nome: 'Peso sollevato totale', valore: 0, obiettivo: settimane * 500, unita: 'kg' },
        { nome: 'Record personale', valore: 0, obiettivo: 100, unita: 'kg' }
      );
    } else if (lower.includes('python') || lower.includes('programma') || lower.includes('coding')) {
      metriche.push(
        { nome: 'Ore studio', valore: 0, obiettivo: settimane * 8, unita: 'ore' },
        { nome: 'Progetti completati', valore: 0, obiettivo: 5, unita: 'progetti' },
        { nome: 'Esercizi risolti', valore: 0, obiettivo: 100, unita: 'esercizi' }
      );
    } else if (lower.includes('leggere') || lower.includes('libri')) {
      metriche.push(
        { nome: 'Pagine lette', valore: 0, obiettivo: settimane * 50, unita: 'pagine' },
        { nome: 'Libri completati', valore: 0, obiettivo: Math.ceil(settimane / 4), unita: 'libri' },
        { nome: 'Minuti lettura giornalieri', valore: 0, obiettivo: 30, unita: 'min' }
      );
    } else if (categoria === 'benessere') {
      metriche.push(
        { nome: 'Giorni di pratica', valore: 0, obiettivo: settimane * 7, unita: 'giorni' },
        { nome: 'Minuti totali', valore: 0, obiettivo: settimane * 150, unita: 'min' },
        { nome: 'Streak record', valore: 0, obiettivo: 30, unita: 'giorni' }
      );
    } else {
      metriche.push(
        { nome: 'Ore dedicate', valore: 0, obiettivo: settimane * 8, unita: 'ore' },
        { nome: 'Task completati', valore: 0, obiettivo: settimane * 3, unita: 'task' },
        { nome: 'Progresso complessivo', valore: 0, obiettivo: 100, unita: '%' }
      );
    }
    
    return metriche;
  }

  // GENERA MILESTONE intelligenti
  private generaMilestone(obiettivo: string, settimane: number, livello: string, categoria: string): Milestone[] {
    const milestone: Milestone[] = [];
    const step = Math.ceil(settimane / 4); // 4 milestone
    const lower = obiettivo.toLowerCase();
    
    // 🏃 CORSA
    if (lower.includes('corsa') || lower.includes('running')) {
      if (livello === 'principiante') {
        milestone.push(
          { settimana: step, obiettivo: '✅ Corri 15 minuti senza fermarti', completato: false },
          { settimana: step * 2, obiettivo: '✅ Completa 3km di fila', completato: false },
          { settimana: step * 3, obiettivo: '✅ Corri 5km in meno di 35min', completato: false },
          { settimana: step * 4, obiettivo: '🏆 Completa la tua prima gara 5km!', completato: false }
        );
      } else if (livello === 'intermedio') {
        milestone.push(
          { settimana: step, obiettivo: '✅ 10km sotto 60 minuti', completato: false },
          { settimana: step * 2, obiettivo: '✅ Corsa lunga 15km', completato: false },
          { settimana: step * 3, obiettivo: '✅ Interval training avanzato', completato: false },
          { settimana: step * 4, obiettivo: '🏆 Half Marathon (21km)!', completato: false }
        );
      } else {
        milestone.push(
          { settimana: step, obiettivo: '✅ 20km sotto 2 ore', completato: false },
          { settimana: step * 2, obiettivo: '✅ Interval 1000m x 5', completato: false },
          { settimana: step * 3, obiettivo: '✅ Long run 30km', completato: false },
          { settimana: step * 4, obiettivo: '🏆 Marathon completa!', completato: false }
        );
      }
    }
    // 💪 FITNESS
    else if (lower.includes('palestra') || lower.includes('fitness')) {
      milestone.push(
        { settimana: step, obiettivo: '✅ Routine stabilita (3x settimana)', completato: false },
        { settimana: step * 2, obiettivo: '✅ Incremento peso +20%', completato: false },
        { settimana: step * 3, obiettivo: '✅ Tutti gli esercizi con forma perfetta', completato: false },
        { settimana: step * 4, obiettivo: '🏆 Obiettivo fisico raggiunto!', completato: false }
      );
    }
    // 📚 PYTHON
    else if (lower.includes('python')) {
      milestone.push(
        { settimana: step, obiettivo: '✅ Sintassi base + 20 esercizi', completato: false },
        { settimana: step * 2, obiettivo: '✅ Primo progetto funzionante', completato: false },
        { settimana: step * 3, obiettivo: '✅ Librerie avanzate + API', completato: false },
        { settimana: step * 4, obiettivo: '🏆 Progetto completo portfolio!', completato: false }
      );
    }
    // 🧘 BENESSERE
    else if (categoria === 'benessere') {
      milestone.push(
        { settimana: step, obiettivo: '✅ Pratica quotidiana stabilita', completato: false },
        { settimana: step * 2, obiettivo: '✅ Meditazione 20 min senza sforzo', completato: false },
        { settimana: step * 3, obiettivo: '✅ Migliore gestione stress', completato: false },
        { settimana: step * 4, obiettivo: '🏆 Trasformazione completata!', completato: false }
      );
    }
    // 📖 LETTURA
    else if (lower.includes('leggere') || lower.includes('libri')) {
      milestone.push(
        { settimana: step, obiettivo: '✅ Primo libro completato', completato: false },
        { settimana: step * 2, obiettivo: '✅ 2 libri completati', completato: false },
        { settimana: step * 3, obiettivo: '✅ 3 libri + note', completato: false },
        { settimana: step * 4, obiettivo: `🏆 ${Math.ceil(settimane / 3)} libri letti!`, completato: false }
      );
    }
    // 🎯 DEFAULT
    else {
      milestone.push(
        { settimana: step, obiettivo: '✅ Fondamentali acquisiti', completato: false },
        { settimana: step * 2, obiettivo: '✅ Livello intermedio raggiunto', completato: false },
        { settimana: step * 3, obiettivo: '✅ Pratica avanzata', completato: false },
        { settimana: step * 4, obiettivo: '🏆 Obiettivo completato!', completato: false }
      );
    }
    
    return milestone;
  }

  // SALVA piano nel calendario
  private salvaPianoNelCalendario(piano: PianoStudio) {
    console.log('📅 Salvo piano nel calendario...');
    
    // Mappa categoria piano -> categoria obiettivo
    const categoriaMappata: 'studio' | 'lavoro' | 'salute' | 'personale' = 
      piano.categoria === 'studio' ? 'studio' :
      piano.categoria === 'lavoro' ? 'lavoro' :
      piano.categoria === 'salute' ? 'salute' :
      'personale'; // sport, hobby, benessere -> personale
    
    // Crea obiettivo principale
    const obiettivo: Obiettivo = {
      id: Date.now(),
      titolo: piano.obiettivo,
      descrizione: `🧠 Piano AI: ${piano.task.length} task • ${piano.durataSettimane} settimane • ${piano.metriche.length} metriche tracking`,
      categoria: categoriaMappata,
      frequenza: 'settimanale',
      ore_necessarie: piano.oreDisponibili * piano.durataSettimane,
      ore_completate: 0,
      progresso: 0,
      data_inizio: new Date(),
      completato: false
    };
    
    this.apiService.obiettivi.update(obs => [...obs, obiettivo]);
    
    // Mappa categoria piano -> categoria impegno
    const categoriaImpegno: 'lavoro' | 'studio' | 'personale' | 'sport' | 'altro' =
      piano.categoria === 'sport' ? 'sport' :
      piano.categoria === 'studio' ? 'studio' :
      piano.categoria === 'lavoro' ? 'lavoro' :
      'personale';
    
    // Aggiungi primi 10 task al calendario
    const primiTask = piano.task.slice(0, 10);
    
    primiTask.forEach(task => {
      const impegno: Impegno = {
        id: task.id,
        titolo: task.titolo,
        descrizione: task.descrizione,
        data: task.giorno,
        ora_inizio: task.oraInizio,
        ora_fine: task.oraFine,
        categoria: categoriaImpegno,
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
