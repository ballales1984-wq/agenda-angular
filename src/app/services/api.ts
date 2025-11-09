import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Impegno } from '../models/impegno';
import { DiarioEntry } from '../models/diario-entry';
import { Obiettivo } from '../models/obiettivo';
import { Spesa } from '../models/spesa';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL del backend Flask (modificabile)
  private apiUrl = signal('http://localhost:5000/api');
  
  // Signals per lo stato dell'app
  public impegni = signal<Impegno[]>([]);
  public diario = signal<DiarioEntry[]>([]);
  public obiettivi = signal<Obiettivo[]>([]);
  public spese = signal<Spesa[]>([]);
  
  constructor(private http: HttpClient) {
    // Carica da localStorage se presente, altrimenti usa demo data
    this.loadFromLocalStorage();
    
    // Salva automaticamente quando cambiano i dati
    this.setupAutoSave();
  }
  
  // Metodo per impostare l'URL dell'API
  setApiUrl(url: string) {
    this.apiUrl.set(url);
    this.loadData();
  }
  
  // Carica dati demo (per testare senza backend)
  private loadDemoData() {
    // Impegni demo
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    this.impegni.set([
      {
        id: 1,
        titolo: 'Riunione Team',
        descrizione: 'Discussione progetto Q4',
        data: today,
        ora_inizio: '10:00',
        ora_fine: '11:30',
        categoria: 'lavoro',
        completato: false,
        promemoria: true
      },
      {
        id: 2,
        titolo: 'Lezione Angular',
        descrizione: 'Studiare componenti e servizi',
        data: today,
        ora_inizio: '15:00',
        ora_fine: '17:00',
        categoria: 'studio',
        completato: true,
        promemoria: false
      },
      {
        id: 3,
        titolo: 'Palestra',
        descrizione: 'Allenamento completo',
        data: tomorrow,
        ora_inizio: '18:00',
        ora_fine: '19:30',
        categoria: 'sport',
        completato: false,
        promemoria: true
      }
    ]);
    
    // Diario demo
    this.diario.set([
      {
        id: 1,
        data: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        contenuto: 'Oggi è stata una giornata produttiva! Ho imparato tantissimo su Angular e i Signals. La reattività è incredibile, mi sento molto motivato a continuare.',
        umore: 'motivato',
        tags: ['angular', 'programmazione', 'successo']
      },
      {
        id: 2,
        data: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        contenuto: 'Ho avuto una bella conversazione con un collega. Abbiamo parlato di architetture software e di come Angular può migliorare i nostri progetti. Mi sento ispirato!',
        umore: 'felice',
        tags: ['lavoro', 'colleghi', 'ispirazione']
      },
      {
        id: 3,
        data: today,
        contenuto: 'Giornata tranquilla. Ho dedicato tempo allo studio e alla riflessione. A volte è importante rallentare e godersi il momento presente.',
        umore: 'neutro',
        tags: ['riflessione', 'studio', 'pace']
      }
    ]);
    
    // Obiettivi demo
    this.obiettivi.set([
      {
        id: 1,
        titolo: 'Imparare Angular',
        descrizione: 'Completare corso avanzato di Angular',
        categoria: 'studio',
        frequenza: 'settimanale',
        ore_necessarie: 20,
        ore_completate: 12,
        progresso: 60,
        data_inizio: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
        completato: false
      },
      {
        id: 2,
        titolo: 'Fitness',
        descrizione: 'Andare in palestra 3 volte a settimana',
        categoria: 'salute',
        frequenza: 'settimanale',
        ore_necessarie: 6,
        ore_completate: 4,
        progresso: 67,
        data_inizio: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        completato: false
      },
      {
        id: 3,
        titolo: 'Leggere 2 libri al mese',
        descrizione: 'Migliorare la cultura personale',
        categoria: 'personale',
        frequenza: 'mensile',
        ore_necessarie: 40,
        ore_completate: 40,
        progresso: 100,
        data_inizio: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000),
        data_scadenza: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        completato: true
      }
    ]);
    
    // Spese demo
    this.spese.set([
      {
        id: 1,
        importo: 50,
        categoria: 'cibo',
        descrizione: 'Spesa settimanale al supermercato',
        data: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        necessaria: true
      },
      {
        id: 2,
        importo: 80,
        categoria: 'trasporti',
        descrizione: 'Abbonamento mensile bus',
        data: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        necessaria: true
      },
      {
        id: 3,
        importo: 35,
        categoria: 'intrattenimento',
        descrizione: 'Cinema con amici',
        data: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        necessaria: false
      },
      {
        id: 4,
        importo: 25,
        categoria: 'salute',
        descrizione: 'Farmacia',
        data: today,
        necessaria: true
      }
    ]);
  }
  
  // Carica tutti i dati dal backend
  private loadData() {
    this.getImpegni().subscribe(data => this.impegni.set(data));
    this.getDiario().subscribe(data => this.diario.set(data));
    this.getObiettivi().subscribe(data => this.obiettivi.set(data));
    this.getSpese().subscribe(data => this.spese.set(data));
  }
  
  // ===== IMPEGNI =====
  
  getImpegni(): Observable<Impegno[]> {
    return this.http.get<Impegno[]>(`${this.apiUrl()}/impegni`)
      .pipe(catchError(() => of([])));
  }
  
  addImpegno(impegno: Impegno): Observable<Impegno> {
    return this.http.post<Impegno>(`${this.apiUrl()}/impegni`, impegno);
  }
  
  updateImpegno(id: number, impegno: Partial<Impegno>): Observable<Impegno> {
    return this.http.put<Impegno>(`${this.apiUrl()}/impegni/${id}`, impegno);
  }
  
  deleteImpegno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl()}/impegni/${id}`);
  }
  
  // ===== DIARIO =====
  
  getDiario(): Observable<DiarioEntry[]> {
    return this.http.get<DiarioEntry[]>(`${this.apiUrl()}/diario`)
      .pipe(catchError(() => of([])));
  }
  
  addDiarioEntry(entry: DiarioEntry): Observable<DiarioEntry> {
    return this.http.post<DiarioEntry>(`${this.apiUrl()}/diario`, entry);
  }
  
  updateDiarioEntry(id: number, entry: Partial<DiarioEntry>): Observable<DiarioEntry> {
    return this.http.put<DiarioEntry>(`${this.apiUrl()}/diario/${id}`, entry);
  }
  
  deleteDiarioEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl()}/diario/${id}`);
  }
  
  // ===== OBIETTIVI =====
  
  getObiettivi(): Observable<Obiettivo[]> {
    return this.http.get<Obiettivo[]>(`${this.apiUrl()}/obiettivi`)
      .pipe(catchError(() => of([])));
  }
  
  addObiettivo(obiettivo: Obiettivo): Observable<Obiettivo> {
    return this.http.post<Obiettivo>(`${this.apiUrl()}/obiettivi`, obiettivo);
  }
  
  updateObiettivo(id: number, obiettivo: Partial<Obiettivo>): Observable<Obiettivo> {
    return this.http.put<Obiettivo>(`${this.apiUrl()}/obiettivi/${id}`, obiettivo);
  }
  
  deleteObiettivo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl()}/obiettivi/${id}`);
  }
  
  // ===== SPESE =====
  
  getSpese(): Observable<Spesa[]> {
    return this.http.get<Spesa[]>(`${this.apiUrl()}/spese`)
      .pipe(catchError(() => of([])));
  }
  
  addSpesa(spesa: Spesa): Observable<Spesa> {
    return this.http.post<Spesa>(`${this.apiUrl()}/spese`, spesa);
  }
  
  deleteSpesa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl()}/spese/${id}`);
  }
  
  // ===== CHAT NLP =====
  
  sendMessage(message: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl()}/chat`, { message });
  }
  
  // ===== PERSISTENZA LOCALE =====
  
  private setupAutoSave() {
    // Salva impegni quando cambiano
    setInterval(() => {
      this.saveToLocalStorage();
    }, 5000); // Salva ogni 5 secondi
  }
  
  private saveToLocalStorage() {
    try {
      localStorage.setItem('agenda_impegni', JSON.stringify(this.impegni()));
      localStorage.setItem('agenda_diario', JSON.stringify(this.diario()));
      localStorage.setItem('agenda_obiettivi', JSON.stringify(this.obiettivi()));
      localStorage.setItem('agenda_spese', JSON.stringify(this.spese()));
    } catch (e) {
      console.error('Errore nel salvare i dati:', e);
    }
  }
  
  private loadFromLocalStorage() {
    try {
      const impegni = localStorage.getItem('agenda_impegni');
      const diario = localStorage.getItem('agenda_diario');
      const obiettivi = localStorage.getItem('agenda_obiettivi');
      const spese = localStorage.getItem('agenda_spese');
      
      if (impegni) {
        this.impegni.set(JSON.parse(impegni));
      } else {
        this.loadDemoData();
      }
      
      if (diario) this.diario.set(JSON.parse(diario));
      if (obiettivi) this.obiettivi.set(JSON.parse(obiettivi));
      if (spese) this.spese.set(JSON.parse(spese));
    } catch (e) {
      console.error('Errore nel caricare i dati:', e);
      this.loadDemoData();
    }
  }
}
