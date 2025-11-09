import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { SpeechService } from '../../services/speech';

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
      
      // Pattern recognition locale (demo migliorato)
      if (lower.includes('agenda') || lower.includes('calendario') || lower.includes('impegno')) {
        // Riconosce impegni nel calendario
        const timePattern = /(\d{1,2}):(\d{2})|(\d{1,2})\s*(del|alle)/i;
        const dayPattern = /(domani|dopodomani|lunedì|martedì|mercoledì|giovedì|venerdì|sabato|domenica)/i;
        
        let details = '';
        if (timePattern.test(message)) {
          const match = message.match(/(\d{1,2}):(\d{2})/);
          if (match) details = ` alle ${match[0]}`;
        }
        
        let when = 'oggi';
        const dayMatch = message.match(dayPattern);
        if (dayMatch) when = dayMatch[0];
        
        response = {
          text: `✅ Perfetto! Ho aggiunto l'impegno "${message}"${details} per ${when} nel calendario! Vai su 📅 Calendario per vederlo.`,
          sender: 'assistant',
          timestamp: new Date(),
          type: 'success'
        };
      } else if (lower.includes('riunione') || lower.includes('appuntamento') || lower.includes('meeting')) {
        response = {
          text: '✅ Impegno aggiunto al calendario! Vai su 📅 Calendario per vedere tutti i tuoi impegni della settimana.',
          sender: 'assistant',
          timestamp: new Date(),
          type: 'success'
        };
      } else if (lower.includes('studiare') || lower.includes('imparare') || lower.includes('corso')) {
        response = {
          text: '🎯 Fantastico! Ho creato un obiettivo di studio per te. Controlla la sezione 📊 Statistiche per vedere il progresso!',
          sender: 'assistant',
          timestamp: new Date(),
          type: 'success'
        };
      } else if (lower.includes('speso') || lower.includes('spesa') || lower.includes('€') || lower.includes('euro') || lower.includes('pagato')) {
        const amountMatch = message.match(/(\d+)\s*€|€\s*(\d+)|(\d+)\s*euro/i);
        const amount = amountMatch ? (amountMatch[1] || amountMatch[2] || amountMatch[3]) : '';
        
        response = {
          text: `💰 Spesa${amount ? ' di €' + amount : ''} registrata con successo! Vai su 📊 Statistiche per vedere i grafici delle spese.`,
          sender: 'assistant',
          timestamp: new Date(),
          type: 'success'
        };
      } else if (lower.includes('diario') || lower.includes('oggi') || lower.includes('sento') || lower.includes('giornata') || lower.includes('pensiero')) {
        response = {
          text: '📖 Ho salvato la tua riflessione nel diario! Vai su 📖 Diario per rileggere tutti i tuoi pensieri. Puoi anche sfogliare con swipe o ascoltarli con 🔊 Leggi!',
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
