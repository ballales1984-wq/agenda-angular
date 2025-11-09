import { Component, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeechService } from '../../services/speech';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-pomodoro-timer',
  imports: [CommonModule],
  templateUrl: './pomodoro-timer.html',
  styleUrl: './pomodoro-timer.css',
})
export class PomodoroTimer implements OnDestroy {
  // Timer settings (in secondi)
  WORK_TIME = 25 * 60; // 25 minuti
  SHORT_BREAK = 5 * 60; // 5 minuti
  LONG_BREAK = 15 * 60; // 15 minuti
  
  // Stato
  timeLeft = signal(this.WORK_TIME);
  isRunning = signal(false);
  mode = signal<'work' | 'shortBreak' | 'longBreak'>('work');
  pomodoroCount = signal(0);
  
  private intervalId: any = null;
  
  // Math per template
  readonly Math = Math;
  
  constructor(
    private speechService: SpeechService,
    private toastService: ToastService
  ) {}
  
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  // Computed per visualizzazione
  minutes = computed(() => Math.floor(this.timeLeft() / 60));
  seconds = computed(() => this.timeLeft() % 60);
  
  formattedTime = computed(() => {
    const m = this.minutes().toString().padStart(2, '0');
    const s = this.seconds().toString().padStart(2, '0');
    return `${m}:${s}`;
  });
  
  progressPercentage = computed(() => {
    let total = this.WORK_TIME;
    if (this.mode() === 'shortBreak') total = this.SHORT_BREAK;
    if (this.mode() === 'longBreak') total = this.LONG_BREAK;
    
    return ((total - this.timeLeft()) / total) * 100;
  });
  
  // Start/Pause
  toggleTimer() {
    if (this.isRunning()) {
      this.pause();
    } else {
      this.start();
    }
  }
  
  start() {
    this.isRunning.set(true);
    
    this.intervalId = setInterval(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update(t => t - 1);
      } else {
        this.timerComplete();
      }
    }, 1000);
  }
  
  pause() {
    this.isRunning.set(false);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  reset() {
    this.pause();
    this.setMode(this.mode());
  }
  
  private timerComplete() {
    this.pause();
    
    if (this.mode() === 'work') {
      this.pomodoroCount.update(c => c + 1);
      
      // Ogni 4 pomodori → pausa lunga
      if (this.pomodoroCount() % 4 === 0) {
        this.setMode('longBreak');
        this.speechService.speak('Ottimo lavoro! Pausa lunga di 15 minuti!');
        this.toastService.success('🎉 4 Pomodori completati! Pausa lunga!');
      } else {
        this.setMode('shortBreak');
        this.speechService.speak('Pomodoro completato! Pausa di 5 minuti.');
        this.toastService.success('✅ Pomodoro completato! Pausa breve.');
      }
    } else {
      this.setMode('work');
      this.speechService.speak('Pausa finita! Torniamo al lavoro!');
      this.toastService.info('💪 Pausa finita! Al lavoro!');
    }
    
    // Notifica browser se supportata
    this.showBrowserNotification();
  }
  
  setMode(mode: 'work' | 'shortBreak' | 'longBreak') {
    this.mode.set(mode);
    
    switch (mode) {
      case 'work':
        this.timeLeft.set(this.WORK_TIME);
        break;
      case 'shortBreak':
        this.timeLeft.set(this.SHORT_BREAK);
        break;
      case 'longBreak':
        this.timeLeft.set(this.LONG_BREAK);
        break;
    }
  }
  
  private showBrowserNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: this.mode() === 'work' ? 'Tempo di lavorare!' : 'Tempo di pausa!',
        icon: '/favicon.ico'
      });
    }
  }
  
  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
  
  getModeLabel(): string {
    switch (this.mode()) {
      case 'work': return '💼 Lavoro';
      case 'shortBreak': return '☕ Pausa Breve';
      case 'longBreak': return '🌴 Pausa Lunga';
    }
  }
  
  getModeColor(): string {
    switch (this.mode()) {
      case 'work': return '#667eea';
      case 'shortBreak': return '#10b981';
      case 'longBreak': return '#f59e0b';
    }
  }
}
