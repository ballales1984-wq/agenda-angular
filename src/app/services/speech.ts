import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  // Stato della sintesi vocale
  isSpeaking = signal(false);
  isEnabled = signal(true); // Attiva di default
  
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
}
