import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  // Stato della sintesi vocale (Text-to-Speech)
  isSpeaking = signal(false);
  isEnabled = signal(true); // Attiva di default
  
  // Stato riconoscimento vocale (Speech-to-Text)
  isListening = signal(false);
  private recognition: any = null;
  
  // Voce selezionata
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  
  constructor() {
    // Carica le voci disponibili
    this.loadVoices();
    
    // Carica preferenza salvata
    const saved = localStorage.getItem('speech_enabled');
    if (saved !== null) {
      this.isEnabled.set(saved === 'true');
    }
    
    // Inizializza riconoscimento vocale
    this.initRecognition();
  }
  
  private loadVoices() {
    // Le voci potrebbero caricarsi in modo asincrono
    const loadVoicesWhenReady = () => {
      this.voices = speechSynthesis.getVoices();
      
      // Cerca voce italiana
      this.selectedVoice = this.voices.find(voice => 
        voice.lang.startsWith('it')
      ) || this.voices[0] || null;
    };
    
    // Carica subito
    loadVoicesWhenReady();
    
    // E quando sono pronte
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoicesWhenReady;
    }
  }
  
  // Leggi testo ad alta voce
  speak(text: string, lang: 'it' | 'en' = 'it') {
    if (!this.isEnabled()) {
      return;
    }
    
    // Ferma sintesi precedente
    this.stop();
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Seleziona voce per lingua
      const voice = this.voices.find(v => v.lang.startsWith(lang));
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.lang = lang === 'it' ? 'it-IT' : 'en-US';
      utterance.rate = 1.0; // Velocità normale
      utterance.pitch = 1.0; // Tono normale
      utterance.volume = 1.0; // Volume massimo
      
      utterance.onstart = () => {
        this.isSpeaking.set(true);
      };
      
      utterance.onend = () => {
        this.isSpeaking.set(false);
      };
      
      utterance.onerror = () => {
        this.isSpeaking.set(false);
      };
      
      speechSynthesis.speak(utterance);
    } else {
      console.warn('Text-to-Speech non supportato da questo browser');
    }
  }
  
  // Ferma sintesi vocale
  stop() {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      this.isSpeaking.set(false);
    }
  }
  
  // Toggle attivazione
  toggle() {
    this.isEnabled.update(enabled => {
      const newValue = !enabled;
      localStorage.setItem('speech_enabled', String(newValue));
      if (!newValue) {
        this.stop();
      }
      return newValue;
    });
  }
  
  // Imposta velocità
  setRate(rate: number) {
    // Rate tra 0.1 e 10
    // Implementabile se necessario
  }
  
  // ===== SPEECH-TO-TEXT (Riconoscimento Vocale) =====
  
  private initRecognition() {
    // Verifica supporto browser
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true; // Continuo - ascolta più a lungo
      this.recognition.interimResults = true; // Mostra risultati intermedi
      this.recognition.maxAlternatives = 1;
      this.recognition.lang = 'it-IT';
      
      this.recognition.onstart = () => {
        this.isListening.set(true);
      };
      
      this.recognition.onend = () => {
        this.isListening.set(false);
      };
      
      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.isListening.set(false);
      };
    }
  }
  
  // Avvia ascolto (restituisce una Promise con il testo riconosciuto)
  startListening(lang: 'it' | 'en' = 'it'): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject('Riconoscimento vocale non supportato');
        return;
      }
      
      // Imposta lingua
      this.recognition.lang = lang === 'it' ? 'it-IT' : 'en-US';
      
      // Raccolta testo con timeout più lungo
      let finalTranscript = '';
      let silenceTimer: any = null;
      
      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Reset timer silenzio - continua ad ascoltare
        if (silenceTimer) clearTimeout(silenceTimer);
        
        // Se c'è testo (finale o interim), aspetta 2 secondi di silenzio prima di finire
        if (finalTranscript || interimTranscript) {
          silenceTimer = setTimeout(() => {
            if (this.recognition) {
              this.recognition.stop();
              if (finalTranscript) {
                resolve(finalTranscript.trim());
              }
            }
          }, 2000); // 2 secondi di silenzio = fine ascolto
        }
      };
      
      this.recognition.onerror = (event: any) => {
        if (silenceTimer) clearTimeout(silenceTimer);
        
        if (event.error === 'no-speech') {
          reject('Non ho sentito niente. Parla più vicino al microfono e riprova!');
        } else if (event.error === 'not-allowed') {
          reject('Permesso microfono negato. Abilita il microfono nelle impostazioni del browser.');
        } else if (event.error === 'aborted') {
          // Normale quando fermiamo manualmente
          if (finalTranscript) {
            resolve(finalTranscript.trim());
          } else {
            reject('Ascolto annullato');
          }
        } else {
          reject(event.error);
        }
      };
      
      this.recognition.onend = () => {
        if (silenceTimer) clearTimeout(silenceTimer);
        this.isListening.set(false);
      };
      
      this.recognition.onnomatch = () => {
        reject('Non ho capito. Riprova parlando più chiaramente!');
      };
      
      try {
        this.recognition.start();
        
        // Timeout massimo di 30 secondi per sicurezza
        setTimeout(() => {
          if (this.recognition && this.isListening()) {
            this.recognition.stop();
          }
        }, 30000);
        
      } catch (e: any) {
        if (e.message && e.message.includes('already started')) {
          reject('Riconoscimento già attivo. Aspetta che finisca.');
        } else {
          reject(e);
        }
      }
    });
  }
  
  // Ferma ascolto
  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening.set(false);
    }
  }
  
  // Verifica se il riconoscimento vocale è supportato
  isRecognitionSupported(): boolean {
    return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
  }
}
