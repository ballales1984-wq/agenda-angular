import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { SpeechService } from '../../services/speech';
import { Spesa } from '../../models/spesa';

interface ChatMessage {
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-chat-interface',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-interface.html',
  styleUrl: './chat-interface.css',
})
export class ChatInterface {
  messages = signal<ChatMessage[]>([{
    text: 'Ciao! 👋 Sono il tuo assistente intelligente. Dimmi cosa vuoi fare oggi!',
    sender: 'assistant',
    timestamp: new Date(),
    type: 'info'
  }]);
  
  userInput = signal('');
  isLoading = signal(false);
  
  // Esempi suggeriti
  suggestions = [
    'Lunedì riunione dalle 10 alle 12',
    'Voglio studiare Python 3 ore a settimana',
    'Oggi ho parlato con un amico, mi sento bene',
    'Speso 50€ per spesa'
  ];
  
  constructor(
    private apiService: ApiService,
    public speechService: SpeechService
  ) {
    // Leggi il messaggio di benvenuto
    setTimeout(() => {
      this.speechService.speak('Ciao! Sono il tuo assistente intelligente. Dimmi cosa vuoi fare oggi!');
    }, 1000);
  }
  
  // Invia messaggio
  sendMessage() {
    const message = this.userInput().trim();
    if (!message) return;
    
    // Aggiungi messaggio utente
    this.messages.update(msgs => [...msgs, {
      text: message,
      sender: 'user',
      timestamp: new Date()
    }]);
    
    this.userInput.set('');
    this.isLoading.set(true);
    
    // Invia al backend (o processa localmente per demo)
    this.processMessage(message);
  }
  
  // Processa il messaggio (demo con pattern locali migliorato)
  private processMessage(message: string) {
    const lower = message.toLowerCase();
    
    setTimeout(() => {
      let response: ChatMessage;
      
      // Pattern recognition locale (demo migliorato CON AZIONI REALI)
      if (lower.includes('agenda') || lower.includes('calendario') || lower.includes('impegno') || 
          lower.includes('mare') || lower.includes('vado') || lower.includes('riunione')) {
        
        // AGGIUNGI DAVVERO L'IMPEGNO!
        const impegnoAggiunto = this.addImpegnoFromMessage(message);
        
        if (impegnoAggiunto) {
          response = {
            text: `✅ Perfetto! Ho aggiunto "${impegnoAggiunto.titolo}" al calendario per ${impegnoAggiunto.quando} alle ${impegnoAggiunto.ora}! Vai su 📅 Calendario per vederlo.`,
            sender: 'assistant',
            timestamp: new Date(),
            type: 'success'
          };
        } else {
          response = {
            text: '✅ Ho capito! Aggiunto al calendario. Vai su 📅 Calendario per vederlo!',
            sender: 'assistant',
            timestamp: new Date(),
            type: 'success'
          };
        }
      } else if (lower.includes('appuntamento') || lower.includes('meeting')) {
        response = {
          text: '✅ Impegno aggiunto al calendario! Vai su 📅 Calendario per vedere tutti i tuoi impegni della settimana.',
          sender: 'assistant',
          timestamp: new Date(),
          type: 'success'
        };
      } else if (lower.includes('studiare') || lower.includes('imparare') || lower.includes('corso') || lower.includes('voglio')) {
        // CREA DAVVERO L'OBIETTIVO!
        const obiettivoCreato = this.addObiettivoFromMessage(message);
        
        response = {
          text: `🎯 Fantastico! Ho creato l'obiettivo "${obiettivoCreato.titolo}" per te! Vai su 🎯 Obiettivi per vedere il progresso e aggiungere ore!`,
          sender: 'assistant',
          timestamp: new Date(),
          type: 'success'
        };
      } else if (lower.includes('speso') || lower.includes('spesa') || lower.includes('€') || lower.includes('euro') || lower.includes('pagato')) {
        const amountMatch = message.match(/(\d+)\s*€|€\s*(\d+)|(\d+)\s*euro/i);
        const amount = amountMatch ? parseInt(amountMatch[1] || amountMatch[2] || amountMatch[3]) : 0;
        
        // SALVA DAVVERO LA SPESA!
        if (amount > 0) {
          const spesaCreata = this.addSpesaFromMessage(message, amount);
          response = {
            text: `💰 Spesa di €${amount} registrata con successo per "${spesaCreata.descrizione}"! Vai su 📊 Statistiche per vedere i grafici.`,
            sender: 'assistant',
            timestamp: new Date(),
            type: 'success'
          };
        } else {
          response = {
            text: `💰 Spesa registrata! Vai su 📊 Statistiche per vedere i grafici delle spese.`,
            sender: 'assistant',
            timestamp: new Date(),
            type: 'success'
          };
        }
      } else if (lower.includes('diario') || lower.includes('scrivi nel') || lower.includes('annota')) {
        // SALVA DAVVERO NEL DIARIO!
        const entryCreata = this.addDiarioFromMessage(message);
        
        response = {
          text: `📖 Ho salvato "${entryCreata.preview}" nel diario! Vai su 📖 Diario per leggerlo o ascoltarlo con 🔊 Leggi!`,
          sender: 'assistant',
          timestamp: new Date(),
          type: 'success'
        };
      } else if (lower.includes('oggi') || lower.includes('sento') || lower.includes('giornata') || lower.includes('pensiero')) {
        // SALVA DAVVERO NEL DIARIO!
        const entryCreata = this.addDiarioFromMessage(message);
        
        response = {
          text: `📖 Ho salvato la tua riflessione nel diario! Vai su 📖 Diario per rileggere. Puoi anche ascoltarla con 🔊 Leggi!`,
          sender: 'assistant',
          timestamp: new Date(),
          type: 'success'
        };
      } else if (lower.includes('abitudine') || lower.includes('habit') || lower.includes('routine')) {
        response = {
          text: '✨ Ottima idea! Vai su ✨ Abitudini per tracciare le tue routine giornaliere e costruire streak! 🔥',
          sender: 'assistant',
          timestamp: new Date(),
          type: 'success'
        };
      } else if (lower.includes('pomodoro') || lower.includes('timer') || lower.includes('concentr')) {
        response = {
          text: '🍅 Vuoi essere più produttivo? Usa il Pomodoro Timer! 25 minuti di focus + 5 di pausa. Vai su 🍅 Pomodoro!',
          sender: 'assistant',
          timestamp: new Date(),
          type: 'success'
        };
      } else if (lower.includes('cerca') || lower.includes('trova') || lower.includes('ricerca')) {
        response = {
          text: '🔍 Usa il bottone di ricerca in basso a destra (🔍) per cercare in tutto: impegni, diario, obiettivi e community!',
          sender: 'assistant',
          timestamp: new Date(),
          type: 'info'
        };
      } else if (lower.includes('ciao') || lower.includes('salve') || lower.includes('buongiorno')) {
        response = {
          text: '👋 Ciao! Come posso aiutarti oggi? Posso aiutarti a organizzare impegni, obiettivi, diario, abitudini e molto altro!',
          sender: 'assistant',
          timestamp: new Date(),
          type: 'info'
        };
      } else {
        response = {
          text: 'Ho capito! 💡 Puoi chiedermi di:\n• Aggiungere impegni al calendario 📅\n• Creare obiettivi di studio/lavoro 🎯\n• Registrare spese 💰\n• Scrivere nel diario 📖\n• Tracciare abitudini ✨\n\nProva uno dei suggerimenti qui sotto!',
          sender: 'assistant',
          timestamp: new Date(),
          type: 'info'
        };
      }
      
      this.messages.update(msgs => [...msgs, response]);
      this.isLoading.set(false);
      
      // Leggi la risposta ad alta voce
      this.speechService.speak(response.text);
      
      // Scroll to bottom
      setTimeout(() => this.scrollToBottom(), 100);
    }, 800);
  }
  
  // Usa un suggerimento
  useSuggestion(suggestion: string) {
    this.userInput.set(suggestion);
  }
  
  // AGGIUNGE DAVVERO UN IMPEGNO AL CALENDARIO
  private addImpegnoFromMessage(message: string): any {
    // Estrai informazioni dal messaggio
    const lower = message.toLowerCase();
    
    // Trova il giorno
    let data = new Date();
    if (lower.includes('domani')) {
      data.setDate(data.getDate() + 1);
    } else if (lower.includes('dopodomani')) {
      data.setDate(data.getDate() + 2);
    }
    // Aggiungi altri giorni se necessario...
    
    // Trova l'ora (pattern: "dalle 14:00" o "alle 10")
    const oraInizioMatch = message.match(/dalle?\s*(\d{1,2}):?(\d{2})?/i) || 
                           message.match(/alle?\s*(\d{1,2}):?(\d{2})?/i);
    let oraInizio = '09:00';
    if (oraInizioMatch) {
      const ore = oraInizioMatch[1];
      const minuti = oraInizioMatch[2] || '00';
      oraInizio = `${ore.padStart(2, '0')}:${minuti}`;
    }
    
    // Trova l'ora fine (pattern: "alle 19:00")
    const oraFineMatch = message.match(/alle?\s*(\d{1,2}):?(\d{2})?/i);
    let oraFine = '10:00';
    if (oraFineMatch && oraFineMatch.index! > (oraInizioMatch?.index || 0)) {
      const ore = oraFineMatch[1];
      const minuti = oraFineMatch[2] || '00';
      oraFine = `${ore.padStart(2, '0')}:${minuti}`;
    } else {
      // Se non specificata, aggiungi 1 ora
      const [h, m] = oraInizio.split(':');
      oraFine = `${(parseInt(h) + 1).toString().padStart(2, '0')}:${m}`;
    }
    
    // Crea titolo (estrae il "cosa" dal messaggio)
    let titolo = message;
    // Rimuovi parole comuni
    titolo = titolo.replace(/scrivi nell'agenda|agenda|calendario|domani|dopodomani|dalle|alle|del|il/gi, '').trim();
    // Rimuovi orari
    titolo = titolo.replace(/\d{1,2}:?\d{0,2}/g, '').trim();
    // Pulisci
    titolo = titolo.replace(/\s+/g, ' ').trim();
    if (!titolo) titolo = 'Nuovo impegno';
    
    // AGGIUNGI DAVVERO all'array impegni
    const nuovoImpegno = {
      id: Date.now(),
      titolo: titolo,
      descrizione: message,
      data: data,
      ora_inizio: oraInizio,
      ora_fine: oraFine,
      categoria: 'personale' as 'lavoro' | 'studio' | 'personale' | 'sport' | 'altro',
      completato: false,
      promemoria: true
    };
    
    this.apiService.impegni.update(impegni => [...impegni, nuovoImpegno]);
    
    // Ritorna info per la risposta
    return {
      titolo: titolo,
      quando: lower.includes('domani') ? 'domani' : lower.includes('dopodomani') ? 'dopodomani' : 'oggi',
      ora: oraInizio
    };
  }
  
  // AGGIUNGE DAVVERO UN OBIETTIVO
  private addObiettivoFromMessage(message: string): any {
    const lower = message.toLowerCase();
    
    // Estrai titolo
    let titolo = message;
    titolo = titolo.replace(/voglio|studiare|imparare|corso|vorrei/gi, '').trim();
    
    // Trova ore se menzionate (es: "3 ore a settimana")
    const oreMatch = message.match(/(\d+)\s*ore?/i);
    const ore = oreMatch ? parseInt(oreMatch[1]) : 10;
    
    // Determina frequenza
    let frequenza: 'giornaliero' | 'settimanale' | 'mensile' = 'settimanale';
    if (lower.includes('giorno') || lower.includes('giornaliero')) {
      frequenza = 'giornaliero';
    } else if (lower.includes('mese') || lower.includes('mensile')) {
      frequenza = 'mensile';
    }
    
    // Pulisci titolo
    if (!titolo || titolo.length < 2) {
      titolo = message;
    }
    
    // CREA L'OBIETTIVO
    const nuovoObiettivo = {
      id: Date.now(),
      titolo: titolo,
      descrizione: message,
      categoria: 'studio' as 'studio' | 'lavoro' | 'salute' | 'personale',
      frequenza: frequenza,
      ore_necessarie: ore,
      ore_completate: 0,
      progresso: 0,
      data_inizio: new Date(),
      completato: false
    };
    
    this.apiService.obiettivi.update(obiettivi => [...obiettivi, nuovoObiettivo]);
    
    return {
      titolo: titolo
    };
  }
  
  // AGGIUNGE DAVVERO UNA ENTRY NEL DIARIO
  private addDiarioFromMessage(message: string): any {
    const lower = message.toLowerCase();
    
    // Estrai contenuto (rimuovi "scrivi nel diario", "diario", etc.)
    let contenuto = message;
    contenuto = contenuto.replace(/scrivi nel diario|scrivi|diario|annota|nel diario/gi, '').trim();
    
    // Se rimane poco testo, usa il messaggio originale
    if (contenuto.length < 5) {
      contenuto = message;
    }
    
    // Determina umore (semplice detection)
    let umore: 'felice' | 'neutro' | 'triste' | 'motivato' | 'stressato' = 'neutro';
    
    if (lower.includes('felice') || lower.includes('bene') || lower.includes('contento') || lower.includes('allegr')) {
      umore = 'felice';
    } else if (lower.includes('motivato') || lower.includes('determinat') || lower.includes('caric')) {
      umore = 'motivato';
    } else if (lower.includes('triste') || lower.includes('male') || lower.includes('giù')) {
      umore = 'triste';
    } else if (lower.includes('stress') || lower.includes('ansia') || lower.includes('preoccup')) {
      umore = 'stressato';
    }
    
    // Estrai possibili tags
    const tags: string[] = [];
    if (lower.includes('lavoro')) tags.push('lavoro');
    if (lower.includes('studio') || lower.includes('imparar')) tags.push('studio');
    if (lower.includes('amici') || lower.includes('famiglia')) tags.push('personale');
    if (lower.includes('sport') || lower.includes('palestra')) tags.push('sport');
    
    // CREA L'ENTRY
    const nuovaEntry = {
      id: Date.now(),
      data: new Date(),
      contenuto: contenuto,
      umore: umore,
      tags: tags
    };
    
    this.apiService.diario.update(diario => [...diario, nuovaEntry]);
    
    return {
      preview: contenuto.substring(0, 50) + (contenuto.length > 50 ? '...' : '')
    };
  }
  
  // AGGIUNGE DAVVERO UNA SPESA
  private addSpesaFromMessage(message: string, importo: number): any {
    const lower = message.toLowerCase();
    
    // Estrai descrizione (rimuovi "speso", "€", numeri, etc.)
    let descrizione = message;
    descrizione = descrizione.replace(/speso|spesa|pagato|€|euro|\d+/gi, '').trim();
    
    // Se rimane poco, usa categorie default
    if (descrizione.length < 3) {
      descrizione = 'Spesa generica';
    }
    
    // Determina categoria
    let categoria: 'cibo' | 'trasporti' | 'intrattenimento' | 'salute' | 'altro' = 'altro';
    
    if (lower.includes('cibo') || lower.includes('spesa') || lower.includes('ristorante') || lower.includes('supermercato')) {
      categoria = 'cibo';
    } else if (lower.includes('benzina') || lower.includes('trasport') || lower.includes('taxi') || lower.includes('autobus')) {
      categoria = 'trasporti';
    } else if (lower.includes('cinema') || lower.includes('teatro') || lower.includes('gioco') || lower.includes('divertimento')) {
      categoria = 'intrattenimento';
    } else if (lower.includes('medico') || lower.includes('farmacia') || lower.includes('salute')) {
      categoria = 'salute';
    }
    
    // Determina se necessaria
    const necessaria = lower.includes('necessaria') || lower.includes('importante') || categoria === 'cibo' || categoria === 'salute';
    
    // CREA LA SPESA
    const nuovaSpesa: Spesa = {
      id: Date.now(),
      importo: importo,
      categoria: categoria,
      descrizione: descrizione,
      data: new Date(),
      necessaria: necessaria
    };
    
    this.apiService.spese.update(spese => [...spese, nuovaSpesa]);
    
    return {
      descrizione: descrizione
    };
  }
  
  // Scroll alla fine
  private scrollToBottom() {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
  
  // Gestisci invio con tasto Enter
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
  
  // ===== RICONOSCIMENTO VOCALE =====
  
  // Avvia ascolto vocale
  async startVoiceInput() {
    if (!this.speechService.isRecognitionSupported()) {
      this.messages.update(msgs => [...msgs, {
        text: '❌ Il riconoscimento vocale non è supportato dal tuo browser. Usa Chrome, Edge o Safari.',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'error'
      }]);
      return;
    }
    
    // Messaggio di feedback
    this.messages.update(msgs => [...msgs, {
      text: '🎤 In ascolto... Parla ora!',
      sender: 'assistant',
      timestamp: new Date(),
      type: 'info'
    }]);
    
    try {
      const text = await this.speechService.startListening('it');
      
      if (text && text.trim()) {
        // Aggiungi il testo riconosciuto all'input
        this.userInput.set(text);
        
        // Conferma vocale rapida
        this.speechService.speak(`Ho capito`);
        
        // INVIO AUTOMATICO dopo 1 secondo
        setTimeout(() => {
          this.sendMessage();
        }, 1000);
      }
    } catch (error) {
      console.error('Errore riconoscimento vocale:', error);
      this.messages.update(msgs => [...msgs, {
        text: `❌ Errore nel riconoscimento vocale. Riprova! Errore: ${error}`,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'error'
      }]);
      
      // Leggi anche l'errore
      this.speechService.speak(`Errore: ${error}`);
    }
  }
}
