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
  
  // Processa il messaggio (demo con pattern locali)
  private processMessage(message: string) {
    const lower = message.toLowerCase();
    
    setTimeout(() => {
      let response: ChatMessage;
      
      // Pattern recognition locale (demo)
      if (lower.includes('riunione') || lower.includes('appuntamento')) {
        response = {
          text: '✅ Perfetto! Ho capito che vuoi aggiungere un impegno. L\'ho inserito nel calendario!',
          sender: 'assistant',
          timestamp: new Date(),
          type: 'success'
        };
      } else if (lower.includes('studiare') || lower.includes('obiettivo')) {
        response = {
          text: '🎯 Grande! Ho creato un nuovo obiettivo per te. Lo trovi nella sezione obiettivi!',
          sender: 'assistant',
          timestamp: new Date(),
          type: 'success'
        };
      } else if (lower.includes('speso') || lower.includes('spesa') || lower.includes('€') || lower.includes('euro')) {
        response = {
          text: '💰 Spesa registrata! La troverai nelle statistiche.',
          sender: 'assistant',
          timestamp: new Date(),
          type: 'success'
        };
      } else if (lower.includes('oggi') || lower.includes('sento') || lower.includes('giornata')) {
        response = {
          text: '📖 Ho salvato la tua riflessione nel diario. Grazie per aver condiviso!',
          sender: 'assistant',
          timestamp: new Date(),
          type: 'success'
        };
      } else {
        response = {
          text: 'Ho capito! Puoi dirmi di più o provare con uno dei suggerimenti qui sotto:',
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
