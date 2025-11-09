import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeechService } from '../../services/speech';

@Component({
  selector: 'app-microphone-test',
  imports: [CommonModule],
  templateUrl: './microphone-test.html',
  styleUrl: './microphone-test.css',
})
export class MicrophoneTest implements OnDestroy {
  isTestingMic = signal(false);
  audioLevel = signal(0);
  testResult = signal('');
  recognizedText = signal('');
  
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private animationId: number | null = null;
  private stream: MediaStream | null = null;
  
  constructor(public speechService: SpeechService) {}
  
  ngOnDestroy() {
    this.stopTest();
  }
  
  // Test microfono con visualizzazione audio
  async startMicTest() {
    try {
      this.testResult.set('🎤 Richiesta permesso microfono...');
      
      // Richiedi accesso microfono
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.testResult.set('✅ Microfono connesso! Parla per vedere il livello audio...');
      this.isTestingMic.set(true);
      
      // Crea contesto audio
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      
      this.microphone = this.audioContext.createMediaStreamSource(this.stream);
      this.microphone.connect(this.analyser);
      
      // Avvia visualizzazione
      this.visualizeAudio();
      
    } catch (error: any) {
      console.error('Errore accesso microfono:', error);
      
      if (error.name === 'NotAllowedError') {
        this.testResult.set('❌ Permesso microfono negato! Abilita il microfono nelle impostazioni del browser.');
      } else if (error.name === 'NotFoundError') {
        this.testResult.set('❌ Nessun microfono trovato! Collega un microfono e riprova.');
      } else {
        this.testResult.set(`❌ Errore: ${error.message}`);
      }
    }
  }
  
  private visualizeAudio() {
    if (!this.analyser) return;
    
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    const update = () => {
      if (!this.analyser) return;
      
      this.analyser.getByteFrequencyData(dataArray);
      
      // Calcola livello medio
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      this.audioLevel.set(Math.round(average));
      
      this.animationId = requestAnimationFrame(update);
    };
    
    update();
  }
  
  stopTest() {
    this.isTestingMic.set(false);
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.microphone) {
      this.microphone.disconnect();
    }
    
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    
    this.audioLevel.set(0);
  }
  
  // Test riconoscimento vocale
  async testSpeechRecognition() {
    this.recognizedText.set('');
    this.testResult.set('🎤 In ascolto... PARLA ORA!');
    
    try {
      const text = await this.speechService.startListening('it');
      
      if (text) {
        this.recognizedText.set(text);
        this.testResult.set(`✅ FUNZIONA! Ho capito: "${text}"`);
      }
    } catch (error) {
      this.testResult.set(`❌ Errore: ${error}`);
      this.recognizedText.set('');
    }
  }
  
  // Verifica supporto
  checkSupport() {
    const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const hasSpeechRecognition = this.speechService.isRecognitionSupported();
    
    let message = '📋 VERIFICA SUPPORTO:\n\n';
    message += hasGetUserMedia ? '✅ Microfono API supportata\n' : '❌ Microfono API NON supportata\n';
    message += hasSpeechRecognition ? '✅ Speech Recognition supportato\n' : '❌ Speech Recognition NON supportato\n';
    message += '\nBrowser consigliati: Chrome, Edge, Safari';
    
    alert(message);
  }
}
